import { reactive } from "vue";

export const sidebarState = reactive({
  isCollapsed: true,
});

export function toggleSidebar() {
  sidebarState.isCollapsed = !sidebarState.isCollapsed;
}