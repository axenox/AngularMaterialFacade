import {
    animate,
    keyframes,
    query,
    stagger,
    state,
    style,
    transition,
    trigger
  } from '@angular/animations';
  
  export const DataTableAnimations = [
    trigger('fabToggler', [
      state('inactive', style({
        transform: 'rotate(0deg)'
      })),
      state('active', style({
        transform: 'rotate(270deg)'
      })),
      transition('* <=> *', animate('100ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    trigger('speedDialStagger', [
      transition('* => *', [
  
        query(':enter', style({ opacity: 0 }), {optional: true}),
  
        query(':enter', stagger('20ms',
          [
            animate('100ms cubic-bezier(0.4, 0.0, 0.2, 1)',
              keyframes(
                [
                  style({opacity: 0, transform: 'translateY(10px)'}),
                  style({opacity: 1, transform: 'translateY(0)'}),
                ]
              )
            )
          ]
        ), {optional: true}),
  
        query(':leave',
          animate('100ms cubic-bezier(0.4, 0.0, 0.2, 1)',
            keyframes([
              style({opacity: 1}),
              style({opacity: 0}),
            ])
          ), {optional: true}
        )
  
      ])
    ])
  ];