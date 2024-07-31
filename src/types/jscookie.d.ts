
declare module "js-cookie" {
  interface CookieAttributes {
    expires?: number | Date;
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: "lax" | "strict" | "none";
  }

  interface Cookies {
    get(name: string): string | undefined;
    getJSON(name: string): any;
    set(name: string, value: any, options?: CookieAttributes): void;
    remove(name: string, options?: CookieAttributes): void;
    withAttributes(attributes: CookieAttributes): Cookies;
    withConverter(converter: any): Cookies;
  }

  const Cookies: Cookies;

  export default Cookies;
}
