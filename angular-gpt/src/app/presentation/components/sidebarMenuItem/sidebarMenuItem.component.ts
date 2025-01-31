import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar-menu-item',
  imports: [RouterModule],
  standalone: true,
  template: `
    <a
      [routerLink]="path"
      routerLinkActive="bg-gray-700"
      class="flex justify-center items-center hover:bg-gray-700 rounded-md transition-colors"
    >
      <i class="{{ icon }} text-2xl ml-2 mr-4 text-indigo-400 my-5"></i>
      <div class="flex flex-col flex-grow">
        <span class="text-white text-lg font-semibold">{{ title }}</span>
        <span class="text-gray-400 text-sm">{{ description }}</span>
      </div>
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarMenuItemComponent {
  @Input({ required: true }) icon!: string;
  @Input({ required: true }) title!: string;
  @Input({ required: true }) description!: string;
  @Input({ required: true }) path!: string;
}
