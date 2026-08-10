'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * An invisible component that listens for globally emitted 'permission-error' events.
 *
 * Previously this THREW the error, which triggered Next.js's full-screen red dev
 * overlay for any background Firestore denial (even harmless ones like a stale
 * likes-counter read) and made the app unusable. We now log the error to the
 * console instead, so denials are still visible to developers without hijacking
 * the whole screen or crashing the app for the user.
 */
export function FirebaseErrorListener() {
  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      // Surface the contextual permission error for debugging, but do not throw —
      // a denied background read should never take over the UI. We use console.debug
      // (not console.error/warn) so Next.js's dev overlay does not flag harmless
      // background denials as "issues". Component-level writes (apply, approve,
      // activate) have their own try/catch + toast, so real failures are still shown.
      console.debug('[Firestore permission denied]', error);
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  // This component renders nothing.
  return null;
}
