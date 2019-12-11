import {findVariablesIn} from "../../src/utils/strings";

describe("strings", ()=>{
    test("It should find single matches", ()=>{
        let matches = findVariablesIn("This is my new #{ComponentName}.tsx");
        expect(matches instanceof Array).toBe(true);
        expect(matches[0][0]).toBe("ComponentName")
    })
})
