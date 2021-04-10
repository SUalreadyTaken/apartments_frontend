import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApartmentsComponent } from './apartments/apartments.component';
import { RecoverComponent } from './recover/recover.component';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css'],
})
export class BodyComponent implements OnInit, AfterViewInit {
  // @ViewChild('apartmentsTemplate', read: TemplateRef) apartmentsTemlate: TemplateRef<any>;
  // @ViewChild('viewContainer', read:ViewContainerRef) viewContainer: ViewContainerRef;
  @ViewChild('viewContainer', { read: ViewContainerRef })
  viewContainer: ViewContainerRef;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private resolver: ComponentFactoryResolver
  ) {}

  ngOnInit(): void {
  }
  
  ngAfterViewInit() {
    console.log(`mofo >> ${this.route.snapshot.data.path}`);
    const dataPath = this.route.snapshot.data.path;
    console.log(`if not given >> ${this.route.snapshot.data.xxx}`);
    if (dataPath === 'recover') {
      console.log('redirect to recover component');
      const componentFactory = this.resolver.resolveComponentFactory(RecoverComponent);
      console.log(componentFactory);
      this.viewContainer.createComponent(componentFactory);
    } else {
      console.log(
        `undefined ? ${this.route.snapshot.data.path === undefined} ? so apartments component`
      );
      const componentFactory = this.resolver.resolveComponentFactory(ApartmentsComponent);
      this.viewContainer.createComponent(componentFactory);
    }

  }
}
