import type { Menu } from '$lib/generated/menus';
import type { Icon } from 'lucide-svelte';
import type { ComponentType } from 'svelte';
import { getMenuIcon } from './menu-icon';
// import { getMenuIcon } from './manu-icon';

export type MenuItemKind = 'group' | 'module' | 'category' | 'item';

export type BaseMenuItem = {
	title: string;
	name?: string;
	icon?: ComponentType;
};

export type GroupMenuItem = BaseMenuItem & {
	kind: 'group';
	slug: Menu;
	children: ModuleMenuItem[];
};

export type ModuleMenuItem = BaseMenuItem & {
	kind: 'module';
	slug: Menu;
	children: (CategoryMenuItem | PageMenuItem)[];
};

export type CategoryMenuItem = BaseMenuItem & {
	kind: 'category';
	slug: Menu;
	children: PageMenuItem[];
};

export type PageMenuItem = BaseMenuItem & {
	kind: 'item';
	slug: Menu;
	url: string;
};

export type MenuItem = GroupMenuItem | ModuleMenuItem | CategoryMenuItem | PageMenuItem;
export type MenuItemUpdated = {
	kind: MenuItemKind | (string & {});
	slug: Menu | (string & {});
	path_name?: string;
	name: string;
	icon?: typeof Icon;
	children: MenuItemUpdated[] | null;
};

export type MenuItemWithState = MenuItemUpdated & {
	isActive: boolean;
	isExpanded: boolean;
	children: MenuItemWithState[] | null;
};

export function computeMenuStates(
	// menu: MenuItemUpdated[],
	menu: ValidUser['modules'],
	currentPathname: string
): MenuItemWithState[] {
	const build = (next: ValidUser['modules']): MenuItemUpdated[] | null =>
		next?.map((item) => ({
			...item,
			icon: getMenuIcon(item.icon),
			children: build(item.children ?? [])
		})) ?? null;

	// Check if a menu item is active based on its kind
	function isMenuActive(item: MenuItemUpdated, pathname: string): boolean {
		// Skip if no path_name is defined
		// if (!item.path_name) return false;

		if (item.kind === 'item') {
			// Exact match for items
			return item.path_name === pathname;
		} else {
			// For group, module, category - check if current path starts with their path_name
			return pathname.startsWith(item.path_name ?? '');
		}
	}

	// Check if any descendant is active
	function hasActiveDescendant(item: MenuItemUpdated, pathname: string): boolean {
		if (isMenuActive(item, pathname)) return true;

		if (!item.children || item.children.length === 0) return false;

		return item.children.some((child) => hasActiveDescendant(child, pathname));
	}

	// Recursively process menu items
	function processMenuItem(item: MenuItemUpdated): MenuItemWithState {
		const isActive = isMenuActive(item, currentPathname);

		let hasActiveChild = false;
		let processedChildren: MenuItemWithState[] | null = null;

		if (item.children && item.children.length > 0) {
			hasActiveChild = item.children.some((child) => hasActiveDescendant(child, currentPathname));
			processedChildren = item.children.map(processMenuItem);
		}

		return {
			...item,
			isActive,
			kind: (item.kind ?? item.children?.length) ? 'module' : 'item',
			isExpanded: isActive || hasActiveChild,
			children: processedChildren ?? []
		};
	}

	// return menu.map(processMenuItem);
	return (build(menu ?? []) ?? []).map(processMenuItem);
}
