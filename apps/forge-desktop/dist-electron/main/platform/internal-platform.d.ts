import { IDesktopContainer } from '../container/interfaces';
export declare class InternalPlatform {
    private static container;
    static initialize(container: IDesktopContainer): void;
    static getService<T>(token: any): T;
}
