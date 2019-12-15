import {Loader} from "load.ts";

describe("openTemplate", ()=>{
    test("should return a template instance", async ()=>{
        let t = new Loader("component");
        expect(t instanceof Loader).toBe(true)
    })
});

describe("checkFile", ()=>{
    let template = new Loader("component");


    beforeEach(()=>{
        template.once(Loader.LOADED)
    });

    test("It should return the matches in a file", async ()=>{
        // @ts-ignore
        return template.once(Loader.LOADED).then((res)=>{
            expect(res).not.toBeUndefined()
        })
    })
});

