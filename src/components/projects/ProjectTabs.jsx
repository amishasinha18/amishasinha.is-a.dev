import { projectTabs } from '../../data/projects.js';
import SegmentedTabs from '../ui/SegmentedTabs.jsx';

export default function ProjectTabs({ active, onChange }) {
  return (
    <SegmentedTabs
      tabs={projectTabs}
      active={active}
      onChange={onChange}
      layoutId="projectsTabHighlight"
    />
  );
}
