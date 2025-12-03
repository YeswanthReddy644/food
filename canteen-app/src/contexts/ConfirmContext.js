import React, { createContext, useCallback, useContext, useState, useEffect, useRef } from 'react';
import './ConfirmModal.css';

const ConfirmContext = createContext(null);

export const ConfirmProvider = ({ children }) => {
  const [state, setState] = useState({ open: false, message: '', showRemember: false, rememberKey: null });
  const [rememberChecked, setRememberChecked] = useState(false);
  const resolverRef = useRef(null);
  const confirmBtnRef = useRef(null);
  const cancelBtnRef = useRef(null);

  const confirm = useCallback((message, options = {}) => {
    const { showRemember = true, rememberKey = 'confirmClearHistory' } = options;

    // If remember key exists and is true, resolve immediately
    try {
      if (rememberKey && localStorage.getItem(rememberKey) === 'true') {
        return Promise.resolve(true);
      }
    } catch (e) {}

    setRememberChecked(false);
    setState({ open: true, message, showRemember, rememberKey });

    return new Promise((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const handleClose = (result) => {
    const { rememberKey } = state;
    if (result && rememberKey && rememberChecked) {
      try { localStorage.setItem(rememberKey, 'true'); } catch (e) {}
    }
    setState((s) => ({ ...s, open: false }));
    if (resolverRef.current) {
      resolverRef.current(result);
      resolverRef.current = null;
    }
  };

  // Accessibility: focus management and Escape key handling
  useEffect(() => {
    if (!state.open) return;

    const onKey = (e) => {
      if (e.key === 'Escape') {
        handleClose(false);
      }
      if (e.key === 'Enter') {
        // Enter activates confirm by default when focused
      }
    };

    document.addEventListener('keydown', onKey);
    // move focus to confirm button for quicker action
    setTimeout(() => {
      if (confirmBtnRef.current) confirmBtnRef.current.focus();
    }, 0);

    return () => document.removeEventListener('keydown', onKey);
  }, [state.open]);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      {state.open && (
        <div className="confirm-backdrop" role="presentation" onMouseDown={() => handleClose(false)}>
          <div className="confirm-modal" role="dialog" aria-modal="true" aria-label="Confirm action" onMouseDown={(e) => e.stopPropagation()}>
            <div className="confirm-title">Confirm action</div>
            <div className="confirm-message">{state.message}</div>

            {state.showRemember && (
              <label className="confirm-remember">
                <input type="checkbox" checked={rememberChecked} onChange={(e) => setRememberChecked(e.target.checked)} />
                <span>Remember and don't ask again</span>
              </label>
            )}

            <div className="confirm-actions">
              <button ref={cancelBtnRef} className="confirm-cancel" onClick={() => handleClose(false)}>Cancel</button>
              <button ref={confirmBtnRef} className="confirm-confirm" onClick={() => handleClose(true)}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider');
  return ctx.confirm;
};

export default ConfirmContext;
