import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  presetWind,
} from 'unocss'

export default defineConfig({
  presets: [
    presetUno(), // 基础预设
    presetWind(), // Tailwind CSS 兼容
    presetAttributify(), // 属性模式
    presetIcons({
      // 图标预设配置
      collections: {
        // 可以添加图标集合
        carbon: () => import('@iconify-json/carbon/icons.json').then(i => i.default),
        mdi: () => import('@iconify-json/mdi/icons.json').then(i => i.default),
      },
    }),
    presetTypography(), // 排版预设
    presetWebFonts({
      // 网络字体预设
      fonts: {
        sans: 'Inter:400,600,700',
        mono: 'Fira Code:400,600',
      },
    }),
  ],
  shortcuts: [
    // 自定义快捷方式
    ['btn', 'px-4 py-1 rounded inline-block bg-teal-600 text-white cursor-pointer hover:bg-teal-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
    ['btn-primary', 'btn bg-blue-600 hover:bg-blue-700'],
    ['btn-secondary', 'btn bg-gray-600 hover:bg-gray-700'],
  ],
  rules: [
    // 自定义规则
    [/^text-(.*)$/, ([, c]) => ({ color: `#${c}` })],
  ],
  theme: {
    colors: {
      // 自定义主题颜色
      primary: '#3b82f6',
      secondary: '#64748b',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
  },
})
