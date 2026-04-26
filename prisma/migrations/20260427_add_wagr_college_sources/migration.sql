-- Legg til WAGR (World Amateur Golf Ranking) og COLLEGE_NCAA som datakilder.
ALTER TYPE "TalentSource" ADD VALUE IF NOT EXISTS 'WAGR';
ALTER TYPE "TalentSource" ADD VALUE IF NOT EXISTS 'COLLEGE_NCAA';
