export function listHead(args: any[], nargs: number) {
  return args.slice(0, nargs);
}

export function listTail(args: any[], nargs: number) {
  return args.slice(nargs);
}
