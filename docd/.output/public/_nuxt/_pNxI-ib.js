import{D as e,b as t,k as n,mt as r,v as i,y as a}from"./CrzdsfCC.js";import{t as o}from"./BDNMzG2s.js";import{t as s}from"./BNnFs6ob.js";var c={key:1,class:`demo-col`},l={key:2,class:`demo-col`},u=`interface User {
  id: number
  name: string
  roles: string[]
}

const formatName = (user: User): string =>
  user.name.toUpperCase()`,d=`<template>
  <q-btn label="Hello" icon="lucide:heart" color="primary" />
</template>`,f=`npm install @dnax/ui
npm run dev
npm run build`,p=`.q-btn {
  --q-btn-h: 40px;
  border-radius: 8px;
}`,m=`{
  "name": "my-app",
  "extends": ["@dnax/ui"]
}`,h=Object.assign(o(n({__name:`DnaxDemoSyntax`,props:{demo:{}},setup(n){return(o,h)=>{let g=s;return n.demo===`basic`?(r(),i(g,{key:0,code:u,lang:`ts`,filename:`utils.ts`,copy:``})):n.demo===`languages`?(r(),t(`div`,c,[e(g,{code:d,lang:`vue`,filename:`App.vue`}),e(g,{code:f,lang:`bash`,filename:`terminal`,copy:``}),e(g,{code:p,lang:`css`,filename:`main.css`}),e(g,{code:m,lang:`json`,filename:`package.json`})])):n.demo===`themes`?(r(),t(`div`,l,[e(g,{code:u,lang:`ts`,filename:`default-theme.ts`,copy:``}),e(g,{code:u,lang:`ts`,theme:`github-light`,filename:`light-theme.ts`,copy:``})])):a(``,!0)}}}),[[`__scopeId`,`data-v-7feace3c`]]),{__name:`DnaxDemoSyntax`});export{h as default};