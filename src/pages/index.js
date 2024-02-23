import React from 'react';
import { graphql, useStaticQuery, Link } from 'gatsby';

function IndexPage() {
  const data = useStaticQuery(graphql`
    query {
      allContentfulLocale {
        edges {
          node {
            code
            default
            name
          }
        }
      }
      allContentfulVideoSelector {
        nodes {
          slug
          titleDisplay
        }
      }
    }
  `);

  const { allContentfulLocale, allContentfulVideoSelector } = data;

  // Collapse all locale results into unique video selectors
  const uniqueVideoSelectors = allContentfulVideoSelector.nodes.reduce((acc, node) => {
    if (!acc.some((item) => item.slug === node.slug)) {
      acc.push(node);
    }
    return acc;
  }, []);

  return (
    <div className="selector-selector">
      <h1>Video selectors</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {uniqueVideoSelectors.map((node) => (
          <div key={node.slug} className="card">
            <h2>{node.titleDisplay}</h2>
            <Link to={node.slug}>
              <button type="button">Default</button>
            </Link>
            {allContentfulLocale.edges.map((locale) => (
              <Link key={locale.node.code} to={`/${locale.node.code}/${node.slug}`}>
                <button type="button">{locale.node.name}</button>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default IndexPage;
