import { LoaderComponent } from './components/loader/loader.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';

import { PadPipe } from './pipes/pad.pipe';
import { KeysPipe } from './pipes/keys.pipe';
import { SpinTestComponent } from './components/spin-test/spin-test.component';

const pipes = [PadPipe, KeysPipe];
const components = [HeaderComponent, FooterComponent, SpinTestComponent];

@NgModule({
  imports: [CommonModule, FormsModule, HttpClientModule, ReactiveFormsModule],
  declarations: [...pipes, ...components,   LoaderComponent],
  providers: [],
  exports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderComponent,
    ...pipes,
    ...components
  ]
})
export class SharedModule {}
