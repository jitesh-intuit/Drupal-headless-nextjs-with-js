import { PageHeader } from '../page-header';
import { NodePlaceTeaser } from '../node--place';

export function TaxonomyPlace({ additionalContent, taxonomy_term }) {
  return (
    <div>
      <PageHeader heading={taxonomy_term.name} text="" />
      <div className="container px-6 pb-10 mx-auto">
        {additionalContent.nodes.length ? (
          <div className="grid gap-14">
            {additionalContent.nodes.map((node) => (
              <NodePlaceTeaser key={node.id} node={node} />
            ))}
          </div>
        ) : (
          <p>No content found.</p>
        )}
      </div>
    </div>
  );
}
