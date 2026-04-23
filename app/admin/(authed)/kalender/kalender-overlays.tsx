"use client";


import { Icon } from "@/components/ui/icon";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

import {
  AdminTextarea,
  AdminInput,
  AdminDialog,
  AdminDrawer,
} from "@/components/portal/coach-hq/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CalendarBooking } from "./actions";
import {
  formatTime,
  formatDuration,
  statusLabels,
  statusBadgeVariant,
  isStatusKey,
} from "./kalender-utils";

interface KalenderOverlaysProps {
  drawerBooking: CalendarBooking | null;
  onCloseDrawer: () => void;
  noteModalBookingId: string | null;
  onCloseNoteModal: () => void;
  noteText: string;
  onNoteTextChange: (text: string) => void;
  onSaveNote: () => void;
  isNotePending: boolean;
  newEventOpen: boolean;
  onCloseNewEvent: () => void;
  newEventForm: {
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    note: string;
  };
  onNewEventFormChange: (
    form: KalenderOverlaysProps["newEventForm"]
  ) => void;
  onCreateEvent: () => void;
  isPending: boolean;
  isNoShowPending: boolean;
  onMarkNoShow: (id: string) => void;
  onOpenNoteModal: (booking: CalendarBooking) => void;
}

export default function KalenderOverlays({
  drawerBooking,
  onCloseDrawer,
  noteModalBookingId,
  onCloseNoteModal,
  noteText,
  onNoteTextChange,
  onSaveNote,
  isNotePending,
  newEventOpen,
  onCloseNewEvent,
  newEventForm,
  onNewEventFormChange,
  onCreateEvent,
  isPending,
  isNoShowPending,
  onMarkNoShow,
  onOpenNoteModal,
}: KalenderOverlaysProps) {
  return (
    <>
      {/* Note Dialog */}
      <AdminDialog
        open={noteModalBookingId !== null}
        onClose={onCloseNoteModal}
        title="Admin-notat"
        description="Internt notat på bookingen"
        footer={
          <>
            <Button variant="secondary" onClick={onCloseNoteModal}>
              Avbryt
            </Button>
            <Button
              variant="accent"
              onClick={onSaveNote}
              isLoading={isNotePending}
              disabled={!noteText.trim()}
            >
              Lagre
            </Button>
          </>
        }
      >
        <AdminTextarea
          value={noteText}
          onChange={(e) => onNoteTextChange(e.target.value)}
          rows={5}
          placeholder="Skriv et notat..."
        />
      </AdminDialog>

      {/* New Event Dialog */}
      <AdminDialog
        open={newEventOpen}
        onClose={onCloseNewEvent}
        title="Ny hendelse"
        description="Opprett en ny kalenderhendelse"
        footer={
          <>
            <Button variant="secondary" onClick={onCloseNewEvent}>
              Avbryt
            </Button>
            <Button
              variant="accent"
              onClick={onCreateEvent}
              disabled={!newEventForm.title.trim() || isPending}
            >
              Opprett
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <AdminInput
            label="Tittel"
            value={newEventForm.title}
            onChange={(e) =>
              onNewEventFormChange({ ...newEventForm, title: e.target.value })
            }
            placeholder="F.eks. Teamsamling"
          />
          <AdminInput
            label="Dato"
            type="date"
            value={newEventForm.date}
            onChange={(e) =>
              onNewEventFormChange({ ...newEventForm, date: e.target.value })
            }
          />
          <div className="grid grid-cols-2 gap-3">
            <AdminInput
              label="Fra"
              type="time"
              value={newEventForm.startTime}
              onChange={(e) =>
                onNewEventFormChange({
                  ...newEventForm,
                  startTime: e.target.value,
                })
              }
            />
            <AdminInput
              label="Til"
              type="time"
              value={newEventForm.endTime}
              onChange={(e) =>
                onNewEventFormChange({
                  ...newEventForm,
                  endTime: e.target.value,
                })
              }
            />
          </div>
          <AdminTextarea
            label="Notat"
            value={newEventForm.note}
            onChange={(e) =>
              onNewEventFormChange({ ...newEventForm, note: e.target.value })
            }
            rows={3}
            placeholder="Valgfritt"
          />
        </div>
      </AdminDialog>

      {/* Booking Details Drawer */}
      <AdminDrawer
        open={drawerBooking !== null}
        onClose={onCloseDrawer}
        title={drawerBooking?.serviceType.name ?? "Booking"}
        description={
          drawerBooking
            ? `${format(new Date(drawerBooking.startTime), "EEEE d. MMMM yyyy", { locale: nb })} kl ${formatTime(drawerBooking.startTime)}`
            : undefined
        }
        width="lg"
        footer={
          drawerBooking && (
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  onOpenNoteModal(drawerBooking);
                }}
              >
                <Icon name="chat" className="w-4 h-4" />
                Notat
              </Button>
              {drawerBooking.status !== "NO_SHOW" &&
                drawerBooking.status !== "COMPLETED" && (
                  <Button
                    variant="secondary"
                    isLoading={isNoShowPending}
                    onClick={() => onMarkNoShow(drawerBooking.id)}
                  >
                    <Icon name="warning" className="w-4 h-4" />
                    Ikke møtt
                  </Button>
                )}
            </div>
          )
        }
      >
        {drawerBooking && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {isStatusKey(drawerBooking.status) && (
                <Badge variant={statusBadgeVariant[drawerBooking.status]}>
                  {statusLabels[drawerBooking.status] || drawerBooking.status}
                </Badge>
              )}
              <Badge variant="muted">{formatDuration(drawerBooking)}</Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Icon name="schedule" className="w-4 h-4 text-on-surface-variant mt-0.5" />
                <div>
                  <div className="text-xs text-on-surface-variant">Tidspunkt</div>
                  <div className="text-sm text-on-surface font-medium tabular-nums">
                    {formatTime(drawerBooking.startTime)}–
                    {formatTime(drawerBooking.endTime)}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Icon name="person" className="w-4 h-4 text-on-surface-variant mt-0.5" />
                <div>
                  <div className="text-xs text-on-surface-variant">Elev</div>
                  <div className="text-sm text-on-surface font-medium">
                    {drawerBooking.student.name || "Ukjent"}
                  </div>
                  {drawerBooking.student.email && (
                    <div className="text-xs text-on-surface-variant">
                      {drawerBooking.student.email}
                    </div>
                  )}
                </div>
              </div>

              {drawerBooking.instructor.user.name && (
                <div className="flex items-start gap-3">
                  <Icon name="check"Circle2 className="w-4 h-4 text-on-surface-variant mt-0.5" />
                  <div>
                    <div className="text-xs text-on-surface-variant">Instruktør</div>
                    <div className="text-sm text-on-surface font-medium">
                      {drawerBooking.instructor.user.name}
                    </div>
                  </div>
                </div>
              )}

              {drawerBooking.location && (
                <div className="flex items-start gap-3">
                  <Icon name="location_on" className="w-4 h-4 text-on-surface-variant mt-0.5" />
                  <div>
                    <div className="text-xs text-on-surface-variant">Lokasjon</div>
                    <div className="text-sm text-on-surface font-medium">
                      {drawerBooking.location.name}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {drawerBooking.adminNotes && (
              <div className="pt-3 border-t border-outline-variant/30">
                <div className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1">
                  Admin-notat
                </div>
                <p className="text-sm text-on-surface whitespace-pre-wrap">
                  {drawerBooking.adminNotes}
                </p>
              </div>
            )}
          </div>
        )}
      </AdminDrawer>
    </>
  );
}
