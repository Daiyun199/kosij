"use client"

import { EnvError } from "@/lib/error/env.error"

class ClientEnv {
   private _STATIC_PROD_BACKEND_URL: string
   public readonly NODE_ENV

   constructor() {
      if(process.env.NEXT_PUBLIC_STATIC_PROD_BACKEND_URL) {
         this._STATIC_PROD_BACKEND_URL = process.env.NEXT_PUBLIC_STATIC_PROD_BACKEND_URL
      } else {
         throw new EnvError("NEXT_PUBLIC_STATIC_PROD_BACKEND_URL", "missing")
      }

      this.NODE_ENV = process.env.NODE_ENV
   }

   get STATIC_PROD_BACKEND_URL(): string {
      return this._STATIC_PROD_BACKEND_URL
   }

   set STATIC_PROD_BACKEND_URL(value: string) {
      this._STATIC_PROD_BACKEND_URL = value
   }
}

export const clientEnv = new ClientEnv()
