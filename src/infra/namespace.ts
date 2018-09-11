import { Module } from "@nestjs/common";
import { createNamespace } from "cls-hooked";

@Module({
    providers: [{
        provide: "Namespace",
        useFactory: () => {
            return createNamespace("retrofeed");
        },
    }],
    exports: ["Namespace"],
})
export class NamespaceModule { }
