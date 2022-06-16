import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: '介绍',
    Svg: require('../../static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        PM2 是一个守护进程管理器，它将帮助您管理和保持您的应用程序<br/><code>pm2 start app.js</code>
      </>
    ),
  },
  {
    title: '特点',
    Svg: require('../../static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        生产环境的完整功能集，由全球开发人员和企业社区构建。
      </>
    ),
  },
  {
    title: '监控',
    Svg: require('../../static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        监控所有启动的进程。<br/><code>pm2 monit</code>
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
