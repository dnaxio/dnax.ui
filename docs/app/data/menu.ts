export interface MenuItem {
  title: string
  link: string
  /** Export dans @dnax/ui (ex. QBtn) — vide pour les guides/plugins */
  export?: string
}

export interface MenuSubgroup {
  title: string
  items: MenuItem[]
}

export interface MenuGroup {
  title: string
  /** Icône Iconify du groupe (affichée à gauche du libellé) */
  icon?: string
  items?: MenuItem[]
  /** Sous-groupes (ex. Layouts > Page) */
  groups?: MenuSubgroup[]
}

export const menuItems: MenuGroup[] = [
  {
    title: "Getting Started",
    icon: "lucide:rocket",
    items: [
      { title: "Installation", link: "/docs/getting-started/installation" },
      { title: "Setup", link: "/docs/getting-started/quick-start" },
    ],
  },
  {
    title: "Layouts",
    icon: "lucide:layout-template",
    groups: [
      {
        title: "Page",
        items: [
          { title: "Header Layout", link: "/docs/components/header", export: "QHeader" },
          { title: "Footer Layout", link: "/docs/components/footer", export: "QFooter" },
          { title: "Page Layout", link: "/docs/components/page", export: "QPage" },
          { title: "Sidebar Layout", link: "/docs/components/sidebar", export: "QSidebar" },
        ],
      },
    ],
  },
  {
    title: "Styles",
    icon: "lucide:frame",
    groups: [
      {
        title: "Columns",
        items: [
          { title: "Grid", link: "/docs/components/grid", export: "QGrid" },
          { title: "Col", link: "/docs/components/col", export: "QCol" },
        ],
      },
      {
        title: "Rows",
        items: [
          { title: "Row", link: "/docs/components/row", export: "QRow" },
        ],
      },
    ],
  },
  {
    title: "Components",
    icon: "lucide:component",
    items: [
      { title: "Accordion", link: "/docs/components/accordion", export: "QAccordion" },
      { title: "Action Sheet", link: "/docs/components/action-sheet", export: "QActionSheet" },
      { title: "App", link: "/docs/components/app", export: "QApp" },
      { title: "Autocomplete", link: "/docs/components/autocomplete", export: "QAutocomplete" },
      { title: "Avatar", link: "/docs/components/avatar", export: "QAvatar" },
      { title: "Back Header", link: "/docs/components/back-header", export: "QBackHeader" },
      { title: "Back Top", link: "/docs/components/back-top", export: "QBackTop" },
      { title: "Badge", link: "/docs/components/badge", export: "QBadge" },
      { title: "Bottom Sheet", link: "/docs/components/bottom-sheet", export: "QBottomSheet" },
      { title: "Bubble", link: "/docs/components/bubble", export: "QBubble" },
      { title: "Button", link: "/docs/components/btn", export: "QBtn" },
      { title: "Button Group", link: "/docs/components/btn-group", export: "QBtnGroup" },
      { title: "Card", link: "/docs/components/card", export: "QCard" },
      { title: "Carousel", link: "/docs/components/carousel", export: "QCarousel" },
      { title: "Checkbox", link: "/docs/components/checkbox", export: "QCheckbox" },
      { title: "Chip", link: "/docs/components/chip", export: "QChip" },
      { title: "Circular Progress", link: "/docs/components/circular-progress", export: "QCircularProgress" },
      { title: "Collapse", link: "/docs/components/collapse", export: "QCollapse" },
      { title: "Config Provider", link: "/docs/components/config-provider", export: "QConfigProvider" },
      { title: "Container", link: "/docs/components/container", export: "QContainer" },
      { title: "Count Down", link: "/docs/components/count-down", export: "QCountDown" },
      { title: "Country Picker", link: "/docs/components/country-picker", export: "QCountryPicker" },
      { title: "Data Grid", link: "/docs/components/data-grid", export: "QDataGrid" },
      { title: "Date Picker", link: "/docs/components/date-picker", export: "QDatePicker" },
      { title: "Dialog", link: "/docs/components/dialog", export: "QDialog" },
      { title: "Fab", link: "/docs/components/fab", export: "QFab" },
      { title: "File Picker", link: "/docs/components/file-picker", export: "QFilePicker" },
      { title: "Icon", link: "/docs/components/icon", export: "QIcon" },
      { title: "Image", link: "/docs/components/img", export: "QImg" },
      { title: "Image Picker", link: "/docs/components/image-picker", export: "QImagePicker" },
      { title: "Image Preview", link: "/docs/components/image-preview", export: "QImagePreview" },
      { title: "Image Preview Provider", link: "/docs/components/image-preview-provider", export: "QImagePreviewProvider" },
      { title: "Infinite Scroll", link: "/docs/components/infinite-scroll", export: "QInfiniteScroll" },
      { title: "Inner Loading", link: "/docs/components/inner-loading", export: "QInnerLoading" },
      { title: "Input", link: "/docs/components/input", export: "QInput" },
      { title: "Input OTP", link: "/docs/components/input-otp", export: "QInputOtp" },
      { title: "Input Password", link: "/docs/components/input-password", export: "QInputPassword" },
      { title: "Input Tag", link: "/docs/components/input-tag", export: "QInputTag" },
      { title: "Linear Progress", link: "/docs/components/linear-progress", export: "QLinearProgress" },
      { title: "List", link: "/docs/components/list", export: "QList" },
      { title: "Loading", link: "/docs/components/loading", export: "QLoading" },
      { title: "Marquee", link: "/docs/components/marquee", export: "QMarquee" },
      { title: "Message Scroller", link: "/docs/components/message-scroller", export: "QMessageScroller" },
      { title: "Nav Menu", link: "/docs/components/nav-menu", export: "QNavMenu" },
      { title: "Pagination", link: "/docs/components/pagination", export: "QPagination" },
      { title: "Parallax", link: "/docs/components/parallax", export: "QParallax" },
      { title: "Pull To Refresh", link: "/docs/components/pull-to-refresh", export: "QPullToRefresh" },
      { title: "Radio", link: "/docs/components/radio", export: "QRadio" },
      { title: "Rating", link: "/docs/components/rating", export: "QRating" },
      { title: "Reorder", link: "/docs/components/reorder", export: "QReorder" },
      { title: "Rolling Text", link: "/docs/components/rolling-text", export: "QRollingText" },
      { title: "Safe Area", link: "/docs/components/safe-area", export: "QSafeArea" },
      { title: "Scroll Area", link: "/docs/components/scroll-area", export: "QScrollArea" },
      { title: "Select", link: "/docs/components/select", export: "QSelect" },
      { title: "Separator", link: "/docs/components/separator", export: "QSeparator" },
      { title: "Skeleton", link: "/docs/components/skeleton", export: "QSkeleton" },
      { title: "Slider", link: "/docs/components/slider", export: "QSlider" },
      { title: "Space", link: "/docs/components/space", export: "QSpace" },
      { title: "Spinner", link: "/docs/components/spinner", export: "QSpinner" },
      { title: "Splitter", link: "/docs/components/splitter", export: "QSplitter" },
      { title: "Sticky", link: "/docs/components/sticky", export: "QSticky" },
      { title: "Swiper", link: "/docs/components/swiper", export: "QSwiper" },
      { title: "Syntax", link: "/docs/components/syntax", export: "QSyntax" },
      { title: "Tab Panels", link: "/docs/components/tab-panels", export: "QTabPanels" },
      { title: "Table", link: "/docs/components/table", export: "QTable" },
      { title: "Tabs", link: "/docs/components/tabs", export: "QTab" },
      { title: "Text", link: "/docs/components/text", export: "QText" },
      { title: "Text Caption", link: "/docs/components/text-caption", export: "QTextCaption" },
      { title: "Toolbar", link: "/docs/components/toolbar", export: "QToolbar" },
      { title: "Tooltip", link: "/docs/components/tooltip", export: "QTooltip" },
      { title: "Video", link: "/docs/components/video", export: "QVideo" },
      { title: "Virtual Scroll", link: "/docs/components/virtual-scroll", export: "QVirtualScroll" },
    ],
  },
  {
    title: "Plugins API",
    icon: "lucide:plug",
    items: [
      { title: "Dialog", link: "/docs/plugins/dialog" },
      { title: "Bottom Sheet", link: "/docs/plugins/bottom-sheet" },
      { title: "Notify", link: "/docs/plugins/notify" },
      { title: "Loading", link: "/docs/plugins/loading" },
      { title: "Image Preview", link: "/docs/plugins/image-preview" },
    ],
  },
]
