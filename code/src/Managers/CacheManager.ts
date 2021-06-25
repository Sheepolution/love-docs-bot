import sizeof from 'object-sizeof';
import { Utils } from '../Utils/Utils';

export default class CacheManager {
    private static cache: any = {};

    public static CreateTimeoutInterval() {
        setInterval(() => {
            CacheManager.OnInterval();
        }, Utils.GetMinutesInMiliSeconds(1));
    }

    public static OnInterval() {
        for (const className in this.cache) {
            for (const methodName in this.cache[className]) {
                const cacheList = this.cache[className][methodName];
                for (let i = 0; i < cacheList.length; i++) {
                    const cache = cacheList[i];
                    if (cache.timeout > -1) {
                        cache.timeout -= 1;
                        if (cache.timeout <= 0) {
                            cacheList.splice(i, 1);
                        }
                    }
                }
            }
        }
    }

    public static GetSizeInfo() {
        const sizeInfo: any = {};
        sizeInfo.total = sizeof(this.cache);

        for (const name in this.cache) {
            sizeInfo[name] = sizeof(this.cache[name]);
        }

        return sizeInfo;
    }

    public static Empty() {
        this.cache = {};
    }

    public static async Get<T>(classType: { new(): any, Make(model: any): T | null | Promise<T | null> }, method: Function, args?: Array<any>, timeout?: number): Promise<T | null> {
        return <T | null>(await this.GetOrCache<T>(classType, method, args, timeout))[0];
    }

    public static async GetMany<T>(classType: { new(): any, Make(model: any): T | null | Promise<T | null> }, method: Function, args?: Array<any>, timeout?: number): Promise<Array<T>> {
        return <Array<T>>await this.GetOrCache<T>(classType, method, args, timeout);
    }

    public static Set<T>(value: T, classType: { new(): any }, method: Function, args?: Array<any>, timeout: number = -1) {
        const methodCache = this.GetMethodCache(classType, method);

        var objectCache = args == null ? methodCache[0] : methodCache.find(c => c.args.equals(args));
        if (objectCache != null) {
            objectCache.value = [value];
            objectCache.timeout = timeout;
        } else {
            objectCache = { value: [value], args: args, timeout: timeout };
            methodCache.push(objectCache);
        }

        return value;
    }

    public static Add<T>(value: T, classType: { new(): any }, method: Function, args?: Array<any>, timeout: number = -1) {
        const methodCache = this.GetMethodCache(classType, method);

        var objectCache = args == null ? methodCache[0] : methodCache.find(c => c.args.equals(args));
        if (objectCache != null) {
            objectCache.value.push(value);
        } else {
            objectCache = { value: [value], args: args, timeout: timeout };
            methodCache.push(objectCache);
        }

        return value;
    }

    public static Clear<T>(classType: { new(): any, Make(model: any): T | null | Promise<T | null> }, method: Function, args?: Array<any>) {
        const methodCache = this.GetMethodCache(classType, method);

        if (args == null) {
            methodCache.length = 0;
            return;
        }

        var objectCacheIndex = methodCache.findIndex(c => c.args.equals(args));

        if (objectCacheIndex == -1) {
            return;
        }

        methodCache.splice(objectCacheIndex, 1);
    }

    private static async GetOrCache<T>(classType: { new(): any, Make(model: any): T | null | Promise<T | null> }, method: Function, args?: Array<any>, timeout: number = -1): Promise<Array<T | null>> {
        const methodCache = this.GetMethodCache(classType, method);

        var objectCache = args == null ? methodCache[0] : methodCache.find(c => c.args.equals(args));

        if (objectCache != null) {
            objectCache.timeout = timeout;
            return objectCache.value;
        }

        var model = await method(...(args || []));

        if (Array.isArray(model)) {
            const models = model;
            var values = [];

            for (const model of models) {
                const value = await classType.Make(model);
                values.push(value);
            }

            objectCache = { value: values, args: args, timeout: timeout };
            methodCache.push(objectCache);

            return values;
        } else {
            const value = [model == null ? null : await classType.Make(model)];
            objectCache = { value: value, args: args, timeout: timeout };
            methodCache.push(objectCache);
            return value;
        }
    }

    private static GetMethodCache(classType: { new(): any }, method: Function) {
        const className = classType.name;
        var classCache = this.cache[className];

        if (classCache == null) {
            classCache = {};
            this.cache[className] = classCache;
        }

        const methodString = method.toString();
        var methodCache: Array<any> = classCache[methodString];

        if (methodCache == null) {
            methodCache = new Array<any>();
            classCache[methodString] = methodCache;
        }

        return methodCache;
    }
}