# Debug Steps

1. Open browser console
2. Login/Register
3. Check console logs for:
   - "Auth state changed" - should show isAuthenticated: true
   - "Setting view to setup" - should appear
   - Check if view state is actually 'setup'

4. Check if setup view is rendering:
   - Look for element with key="setup"
   - Check if ClassSelector component is in DOM
   - Check CSS - is content hidden or positioned off-screen?

5. Common issues:
   - AnimatePresence might be blocking render
   - Absolute positioning might be wrong
   - z-index might be hiding content
   - View state not updating

