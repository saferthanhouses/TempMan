import {TemplateLoader} from "../../src/lib/TemplateLoader";

describe("openTemplate", ()=>{
    test("should return a template instance", async ()=>{
        let t = new TemplateLoader("component");
        expect(t instanceof TemplateLoader).toBe(true)
    })
});

describe("checkFile", ()=>{
    let template = new TemplateLoader("component");


    beforeEach(()=>{
        template.once(TemplateLoader.LOADED)
    });

    test("It should return the matches in a file", async ()=>{
        // @ts-ignore
        return template.once(TemplateLoader.LOADED).then((res)=>{
            expect(res).not.toBeUndefined()
        })
    })
});

