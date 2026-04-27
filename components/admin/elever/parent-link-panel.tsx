"use client";

import { useEffect, useState, useTransition } from "react";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui";
import {
  AdminInput,
  useToast,
} from "@/components/portal/mission-control/ui";
import {
  listParentsForChild,
  searchPotentialParents,
  createParentAndLink,
  linkExistingParent,
  removeParentLink,
  type ParentSummary,
} from "@/app/admin/(authed)/elever/parent-actions";

const MAX_PARENTS = 2;

interface ParentLinkPanelProps {
  childId: string;
  childName: string;
}

interface SearchResult {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

export function ParentLinkPanel({ childId, childName }: ParentLinkPanelProps) {
  const { toast } = useToast();
  const [parents, setParents] = useState<ParentSummary[] | null>(null);
  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState<"none" | "search" | "create">("none");

  // Søk eksisterende
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  // Ny forelder
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [relationType, setRelationType] = useState("PARENT");

  async function reload() {
    const data = await listParentsForChild(childId);
    setParents(data);
  }

  useEffect(() => {
    let active = true;
    listParentsForChild(childId)
      .then((data) => {
        if (active) setParents(data);
      })
      .catch(() => {
        if (active) setParents([]);
      });
    return () => {
      active = false;
    };
  }, [childId]);

  // Debounced søk
  useEffect(() => {
    if (mode !== "search" || searchQuery.length < 2) {
      return;
    }
    let active = true;
    const t = setTimeout(() => {
      searchPotentialParents({ childId, query: searchQuery })
        .then((data) => {
          if (active) setSearchResults(data);
        })
        .catch(() => {
          if (active) setSearchResults([]);
        });
    }, 300);
    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [searchQuery, childId, mode]);

  const remaining = parents ? MAX_PARENTS - parents.length : MAX_PARENTS;

  function handleLinkExisting(parentId: string) {
    startTransition(async () => {
      try {
        await linkExistingParent({ parentId, childId, relationType });
        toast({ variant: "success", title: "Forelder koblet" });
        setMode("none");
        setSearchQuery("");
        setSearchResults([]);
        await reload();
      } catch (err) {
        toast({
          variant: "error",
          title: "Kunne ikke koble",
          description: err instanceof Error ? err.message : "Ukjent feil",
        });
      }
    });
  }

  function handleCreate() {
    startTransition(async () => {
      try {
        await createParentAndLink({
          childId,
          name: newName,
          email: newEmail,
          phone: newPhone || undefined,
          relationType,
        });
        toast({
          variant: "success",
          title: "Forelder opprettet og koblet",
          description: "Forelderen kan logge inn med samme e-post.",
        });
        setMode("none");
        setNewName("");
        setNewEmail("");
        setNewPhone("");
        await reload();
      } catch (err) {
        toast({
          variant: "error",
          title: "Kunne ikke opprette",
          description: err instanceof Error ? err.message : "Ukjent feil",
        });
      }
    });
  }

  function handleRemove(parentId: string) {
    if (!confirm("Fjerne forelderens kobling til denne spilleren?")) return;
    startTransition(async () => {
      try {
        await removeParentLink({ parentId, childId });
        toast({ variant: "success", title: "Kobling fjernet" });
        await reload();
      } catch (err) {
        toast({
          variant: "error",
          title: "Kunne ikke fjerne",
          description: err instanceof Error ? err.message : "Ukjent feil",
        });
      }
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-on-surface">
          Foreldre / foresatte
        </h3>
        {remaining > 0 && mode === "none" ? (
          <div className="flex gap-1">
            <Button variant="secondary" onClick={() => setMode("search")} disabled={isPending}>
              <Icon name="search" className="w-4 h-4" />
              Søk
            </Button>
            <Button variant="accent" onClick={() => setMode("create")} disabled={isPending}>
              <Icon name="add" className="w-4 h-4" />
              Ny forelder
            </Button>
          </div>
        ) : null}
      </div>

      {parents === null ? (
        <p className="text-sm text-on-surface-variant">Laster...</p>
      ) : parents.length === 0 ? (
        <p className="text-sm text-on-surface-variant">
          Ingen foreldre koblet til {childName} ennå. Maks {MAX_PARENTS} per spiller.
        </p>
      ) : (
        <ul className="space-y-2">
          {parents.map((p) => (
            <li
              key={p.id}
              className="flex items-start justify-between gap-3 rounded-lg border border-outline-variant/30 p-3"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <strong className="text-sm text-on-surface">
                    {p.name ?? "(uten navn)"}
                  </strong>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-surface-container text-on-surface">
                    {p.relationType === "GUARDIAN" ? "Foresatt" : "Forelder"}
                  </span>
                </div>
                <div className="text-xs text-on-surface-variant mt-1">
                  {p.email}
                  {p.phone ? ` · ${p.phone}` : ""}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(p.id)}
                disabled={isPending}
                className="p-1.5 rounded hover:bg-error-light text-on-surface-variant hover:text-error"
                aria-label="Fjern kobling"
                title="Fjern kobling"
              >
                <Icon name="link_off" className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {mode === "search" ? (
        <div className="rounded-lg border border-outline-variant/30 p-3 space-y-2 bg-surface">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1">
              <AdminInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Søk på navn eller e-post"
              />
            </div>
            <Button variant="secondary" onClick={() => setMode("none")}>
              Avbryt
            </Button>
          </div>

          <select
            value={relationType}
            onChange={(e) => setRelationType(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-outline-variant bg-surface text-on-surface text-sm"
          >
            <option value="PARENT">Forelder</option>
            <option value="GUARDIAN">Foresatt</option>
          </select>

          {searchResults.length > 0 ? (
            <ul className="space-y-1">
              {searchResults.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => handleLinkExisting(r.id)}
                    disabled={isPending}
                    className="w-full text-left p-2 rounded-lg hover:bg-surface-container text-sm"
                  >
                    <div className="font-semibold text-on-surface">
                      {r.name ?? r.email}
                    </div>
                    <div className="text-xs text-on-surface-variant">
                      {r.email} · {r.role}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : searchQuery.length >= 2 ? (
            <p className="text-xs text-on-surface-variant">
              Ingen treff. Prøv &quot;Ny forelder&quot; for å opprette en ny.
            </p>
          ) : null}
        </div>
      ) : null}

      {mode === "create" ? (
        <div className="rounded-lg border border-outline-variant/30 p-3 space-y-2 bg-surface">
          <div className="grid grid-cols-2 gap-2">
            <AdminInput
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Fullt navn"
            />
            <AdminInput
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="E-post"
            />
          </div>
          <AdminInput
            type="tel"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            placeholder="Mobil (valgfritt)"
          />
          <select
            value={relationType}
            onChange={(e) => setRelationType(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-outline-variant bg-surface text-on-surface text-sm"
          >
            <option value="PARENT">Forelder</option>
            <option value="GUARDIAN">Foresatt</option>
          </select>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="secondary" onClick={() => setMode("none")}>
              Avbryt
            </Button>
            <Button variant="accent" onClick={handleCreate} isLoading={isPending}>
              Opprett og koble
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
