//! Create this file images.d.ts and declare the modules so we can use them.
//! Because TypeScript only understands .ts, .tsx, .js, .json by default — not images like .png, .jpg, .svg, etc.
//
//! The .d in the filename stands for declaration and is for type declarations only.
//! With .d in the filename "This file contains ONLY type declarations. There is NO runtime JavaScript here.".
//! Without .d in the filename "There is runtime JavaScript here.".
declare module "*.png" {
    const value: any;
    export default value;
}

declare module "*.jpg" {
    const value: any;
    export default value;
}

declare module "*.jpeg" {
    const value: any;
    export default value;
}

declare module "*.gif" {
    const value: any;
    export default value;
}

declare module "*.svg" {
    const value: any;
    export default value;
}
