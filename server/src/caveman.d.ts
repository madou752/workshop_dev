declare module "caveman" {
  interface CavemanStatic {
    (template: string, data?: unknown): string;
    render(partialName: string, data: unknown): string;
    register(partialName: string, template: string): void;
    escapeHTML(str: string): string;
  }
  const Caveman: CavemanStatic;
  export default Caveman;
}
