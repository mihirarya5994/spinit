import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { DevScripts, ProdScripts } from "./assets/lib/GA-Scripts";

if (environment.production) {
  enableProdMode();
  for (let script of ProdScripts) {
    let node = document.createElement("script");
    node.innerHTML = script;
    node.type = "text/javascript";
    node.async = true;
    node.charset = "utf-8";
    document.getElementsByTagName("head")[0].appendChild(node);
  }
 } else {
  for (let script of DevScripts) {
    let node = document.createElement("script");
    node.innerHTML = script;
    node.type = "text/javascript";
    node.async = true;
    node.charset = "utf-8";
    document.getElementsByTagName("head")[0].appendChild(node);
  }
 }

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
