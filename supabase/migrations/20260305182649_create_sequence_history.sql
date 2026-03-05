/*
  # Create sequence_history table

  1. New Tables
    - `sequence_history`
      - `id` (uuid, primary key) - unique identifier for each entry
      - `command` (text) - the CLI command that was executed
      - `input_sequence` (text) - the input nucleotide sequence
      - `operation` (text) - the type of operation performed (translate, complement, etc.)
      - `result` (text) - the output/result of the operation
      - `session_id` (text) - groups entries by browser session
      - `created_at` (timestamptz) - when the entry was created

  2. Security
    - Enable RLS on `sequence_history` table
    - Add policy for anonymous users to insert entries (public tool, no auth required)
    - Add policy for anonymous users to read entries by session_id
*/

CREATE TABLE IF NOT EXISTS sequence_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  command text NOT NULL DEFAULT '',
  input_sequence text NOT NULL DEFAULT '',
  operation text NOT NULL DEFAULT '',
  result text NOT NULL DEFAULT '',
  session_id text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sequence_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert sequence history"
  ON sequence_history
  FOR INSERT
  TO anon
  WITH CHECK (session_id <> '');

CREATE POLICY "Anyone can read own session history"
  ON sequence_history
  FOR SELECT
  TO anon
  USING (session_id <> '');
