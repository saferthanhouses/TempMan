import {parseCommandLineArgs} from "index.ts";



describe("FUNC: parseCommandLineArgs", ()=>{
    test('Accepts a single data string', ()=>{
        let {name, data, dest} = parseCommandLineArgs(["component", "MyComponent", "./src"]);
        expect(name).toBe("component")
        expect(data).toBe("MyComponent")
        expect(dest.dir + "/" + dest.name).toBe("./src")
    });

    test('Accepts a single name data key', ()=>{
        let {name, data, dest} = parseCommandLineArgs(["component", "--componentName", "MyComponent", "./src"]);
        expect(name).toBe("component");
        expect(data).toHaveProperty("componentName", "MyComponent");
    });

    test('Accepts multiple name data keys', ()=>{
        let {name, data, dest} = parseCommandLineArgs(["component", "--componentName", "MyComponent", "--upperCase", "true", "./src"]);
        expect(name).toBe("component");
        expect(data).toHaveProperty("componentName", "MyComponent");
        expect(data).toHaveProperty("upperCase", "true");
    });
})
