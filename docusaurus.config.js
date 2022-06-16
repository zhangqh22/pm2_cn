const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'PM2中文网',
  tagline: 'NODE.JS 的高级生产进程管理器',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.
  scripts: [
    {src: 'https://hm.baidu.com/hm.js?1d1ae48f28520c0cc223f23f016e68b2', async: true}, // 百度统计
  ],
  themeConfig: {
    navbar: {
      title: 'PM2中文网',
      logo: {
        alt: 'PM2中文网',
        src: 'img/img-logo-short.png',
      },
      items: [
        {
          type: 'doc',
          docId: 'start',
          position: 'left',
          label: '文档',
        },
        {to: '/blog', label: '博客', position: 'left'},
        {
          href: 'https://pm2.io/',
          label: '英文网',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '文档',
          items: [
            {
              label: '快速开始',
              to: '/docs/start',
            },
          ],
        },
        {
          title: '文档链接',
          items: [
            {
              label: '技术开发分享录',
              href: 'https://www.fenxianglu.cn',
            },
            {
              label: 'Day.js中文网',
              href: 'https://dayjs.fenxianglu.cn',
            },
            {
              label: 'Turf.js中文网',
              href: 'https://turfjs.fenxianglu.cn',
            },
            {
              label: 'flex-data-table2中文网',
              href: 'https://www.fenxianglu.cn/flexdatatable2',
            },
          ],
        },
        {
          title: '友情链接',
          items: [
            {
              label: '免费字体',
              href: 'https://ziti.fenxianglu.cn',
            },
            {
              label: '高清壁纸',
              href: 'https://image.fenxianglu.cn',
            },
            {
              label: '抖音流行音乐',
              href: 'https://music.fenxianglu.cn',
            },
            {
              label: '资源下载',
              href: 'https://ziyuan.fenxianglu.cn',
            }
          ],
        }
      ],
      copyright: `Copyright©2021 <a href="http://beian.miit.gov.cn/" target="_blank">皖ICP备19023624号-2</a> 联系邮箱：<a href="mailto:443343203@qq.com">443343203@qq.com</a>`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  themes: ['@docusaurus/theme-live-codeblock'],
};
