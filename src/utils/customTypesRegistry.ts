export const customTypesRegistry: Record<string, (value: any) => boolean> = {
  fluxReq: (value) => value?.type === 'fluxReq',
};