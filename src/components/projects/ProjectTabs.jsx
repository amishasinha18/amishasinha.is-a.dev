import { useContent } from '../../content/ContentContext.jsx';
import SegmentedTabs from '../ui/SegmentedTabs.jsx';

export default function ProjectTabs({ active, onChange }) {
  const { projectTabs } = useContent();
  return (
    <SegmentedTabs
      tabs={projectTabs}
      active={active}
      onChange={onChange}
      layoutId="projectsTabHighlight"
    />
  );
}
