export interface MenuItem {
    icon?: string;
    title: string;
    click: (viz: any) => void;
}