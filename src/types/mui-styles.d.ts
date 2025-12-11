declare module '@mui/styles' {
  // Minimal declaration to silence TS7016 when using @mui/styles
  // If you need stricter typing later, replace with detailed types.
  const content: any;
  export default content;
}
// Temporary TypeScript declaration to silence "Could not find a declaration file for module '@mui/styles'"
// This tells TS to treat the module as having an `any` type. Prefer adding proper types
// or migrating away from `@mui/styles` in the long term.
declare module '@mui/styles';

export {};
