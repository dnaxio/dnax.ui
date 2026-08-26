---
title: Accordion
description: "Accordion — single/multiple, collapsible. Parts: AccordionContent, AccordionItem, AccordionTrigger."
navigation:
  icon: lucide:chevrons-down-up
componentApi:
  heading: API
  components:
    - path: ../packages/ui/components/QAccordion.vue
      title: Accordion
    - path: ../packages/ui/components/QAccordionContent.vue
      title: AccordionContent
    - path: ../packages/ui/components/QAccordionItem.vue
      title: AccordionItem
    - path: ../packages/ui/components/QAccordionTrigger.vue
      title: AccordionTrigger
---

## Example

```vue
<q-accordion v-model="open" type="single" collapsible>
  <q-accordion-item value="intro">
    <q-accordion-trigger>Introduction</q-accordion-trigger>
    <q-accordion-content>
      <p>Section content, collapsible with animation.</p>
    </q-accordion-content>
  </q-accordion-item>
  <q-accordion-item value="api">
    <q-accordion-trigger>API</q-accordion-trigger>
    <q-accordion-content>
      <p>API section below.</p>
    </q-accordion-content>
  </q-accordion-item>
</q-accordion>
```

## AccordionContent

```vue
<q-accordion-content>Animated item content</q-accordion-content>
```

## AccordionItem

```vue
<q-accordion-item value="intro">
  <q-accordion-trigger>Title</q-accordion-trigger>
  <q-accordion-content>Content</q-accordion-content>
</q-accordion-item>
```

## AccordionTrigger

```vue
<q-accordion-trigger>Section title</q-accordion-trigger>
```

