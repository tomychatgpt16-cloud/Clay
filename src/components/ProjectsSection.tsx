import { useState } from 'react';
import { MapPin, ArrowRight, X, Sparkles } from 'lucide-react';
import { ARCHITECTURAL_PROJECTS } from '../data/stoneData';
import { ProjectCategory, ArchitecturalProject } from '../types';
import ArchitecturalImage from './ArchitecturalImage';

interface ProjectsSectionProps {
  onSelectProjectForQuote: (stoneName: string, application: string) => void;
}

export default function ProjectsSection({ onSelectProjectForQuote }: ProjectsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('ALL');
  const [selectedProject, setSelectedProject] = useState<ArchitecturalProject | null>(null);

  const categories: ProjectCategory[] = [
    'ALL',
    'STAIRS',
    'INTERIORS',
    'FACADES',
    'COMMERCIAL',
    'RESIDENTIAL'
  ];

  const filteredProjects = ARCHITECTURAL_PROJECTS.filter(project => {
    if (activeCategory === 'ALL') return true;
    return project.category === activeCategory;
  });

  return (
    <section 
      id="projects"
      className="py-28 sm:py-36 bg-[#F4F3EF] relative border-t border-[#D8D6D1] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Editorial Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <span className="w-8 h-[1px] bg-[#858582]" />
            <span className="text-[11px] font-semibold tracking-[0.3em] text-[#414240] uppercase">
              EDITORIAL PROJECT GALLERY
            </span>
            <span className="w-8 h-[1px] bg-[#858582]" />
          </div>

          <h2 
            id="projects-heading"
            className="text-4xl sm:text-6xl font-serif text-[#111211] tracking-tight leading-tight mb-4 font-normal"
          >
            Architectural Showcase
          </h2>

          <p className="text-[#414240] text-base sm:text-lg font-sans font-light tracking-wide max-w-xl">
            A curated editorial showcase of Ethiopian natural stone in signature commercial developments, diplomatic complexes, and luxury private residences.
          </p>

          {/* Editorial Category Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`project-filter-${cat.toLowerCase()}`}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 text-xs font-semibold tracking-[0.18em] uppercase rounded-sm transition-all duration-300 border cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#111211] text-[#F4F3EF] border-[#111211] shadow-md -translate-y-0.5'
                    : 'bg-white text-[#414240] hover:text-[#111211] border-[#D8D6D1] hover:bg-[#D8D6D1]/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Editorial Magazine Grid */}
        <div 
          id="projects-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10"
        >
          {filteredProjects.map((project, index) => {
            const slotPath = `/images/projects/${project.id}.jpg`;

            return (
              <article
                key={project.id}
                id={`project-card-${project.id}`}
                onClick={() => setSelectedProject(project)}
                className="group flex flex-col justify-between bg-white border border-[#D8D6D1] hover:border-[#858582] rounded-sm overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl shadow-sm cursor-pointer"
              >
                <div>
                  {/* Dominant Editorial Photo Box */}
                  <div className="relative aspect-[16/11] overflow-hidden bg-[#202120]">
                    <ArchitecturalImage
                      src={slotPath}
                      fallbackUrl={project.imageUrl}
                      alt={`${project.title} - Architectural Stone`}
                      title={project.title}
                      slotPath={slotPath}
                      aspectRatio="aspect-[16/11]"
                      className="w-full h-full"
                    />

                    <div className="absolute top-3.5 left-3.5 z-20">
                      <span className="px-3 py-1 text-[10px] font-mono font-bold tracking-widest uppercase bg-[#111211]/90 text-[#F4F3EF] border border-[#414240] rounded-sm backdrop-blur-md">
                        {project.category}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3.5 z-20 flex items-center gap-1.5 text-[11px] text-[#F4F3EF] bg-[#111211]/80 px-2.5 py-1 rounded-sm border border-[#414240]/60 backdrop-blur-md">
                      <MapPin className="w-3.5 h-3.5 text-[#D8D6D1]" />
                      <span className="font-mono text-[10px]">{project.location}</span>
                    </div>
                  </div>

                  {/* Project Metadata */}
                  <div className="p-6 sm:p-7">
                    <span className="text-[10px] font-mono tracking-widest text-[#858582] uppercase block mb-1">
                      PROJECT 0{index + 1}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif text-[#111211] tracking-wide mb-3 group-hover:text-[#414240] transition-colors font-medium">
                      {project.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#414240] font-sans font-light leading-relaxed mb-5 line-clamp-2">
                      {project.scopeNote}
                    </p>

                    {/* Specification Details Bar */}
                    <div className="space-y-2 pt-4 border-t border-[#D8D6D1] text-xs">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-[#858582] shrink-0">
                          Stone Used:
                        </span>
                        <span className="font-serif font-bold text-[#111211] text-right">
                          {project.stoneUsed}
                        </span>
                      </div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-[#858582] shrink-0">
                          Application:
                        </span>
                        <span className="text-[#414240] font-medium text-right">
                          {project.application}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* View Project Button */}
                <div className="p-6 pt-0 mt-auto">
                  <button
                    id={`btn-open-project-${project.id}`}
                    className="w-full py-2.5 text-xs font-semibold tracking-wider text-[#111211] group-hover:text-white bg-[#F4F3EF] group-hover:bg-[#111211] border border-[#B7B6B2] group-hover:border-[#111211] rounded-sm flex items-center justify-center gap-1.5 transition-all duration-300"
                  >
                    <span>VIEW CASE STUDY</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Project Detail Magazine Overlay */}
        {selectedProject && (
          <div 
            id="project-detail-modal"
            className="fixed inset-0 z-50 bg-[#111211]/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-8 animate-in fade-in duration-300"
            onClick={() => setSelectedProject(null)}
          >
            <div 
              className="relative w-full max-w-4xl bg-white border border-[#B7B6B2] rounded-sm overflow-hidden shadow-2xl my-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-[#202120]">
                <ArchitecturalImage
                  src={`/images/projects/${selectedProject.id}.jpg`}
                  fallbackUrl={selectedProject.imageUrl}
                  alt={selectedProject.title}
                  title={selectedProject.title}
                  slotPath={`/images/projects/${selectedProject.id}.jpg`}
                  aspectRatio="aspect-[16/9]"
                  className="w-full h-full"
                />

                <button
                  id="close-project-modal"
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#111211]/80 text-white hover:bg-black transition-colors cursor-pointer border border-[#414240]"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
                  <span className="px-3 py-1 bg-[#111211]/90 backdrop-blur-md text-[10px] font-mono text-[#F4F3EF] border border-[#414240] rounded-sm">
                    {selectedProject.category}
                  </span>
                  <span className="px-3 py-1 bg-[#111211]/90 backdrop-blur-md text-[10px] font-mono text-[#D8D6D1] border border-[#414240] rounded-sm flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#D8D6D1]" />
                    {selectedProject.location}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <h3 className="text-2xl sm:text-4xl font-serif text-[#111211] tracking-wide mb-3 font-medium">
                  {selectedProject.title}
                </h3>

                <p className="text-sm sm:text-base text-[#414240] font-sans font-light leading-relaxed mb-6">
                  {selectedProject.scopeNote}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-sm bg-[#F4F3EF] border border-[#D8D6D1] mb-6 text-xs">
                  <div>
                    <span className="text-[#858582] block uppercase font-mono tracking-wider text-[10px] mb-1">
                      Material Specification
                    </span>
                    <span className="text-[#111211] font-serif font-bold text-sm">
                      {selectedProject.stoneUsed}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#858582] block uppercase font-mono tracking-wider text-[10px] mb-1">
                      Architectural Execution
                    </span>
                    <span className="text-[#111211] font-sans font-medium text-sm">
                      {selectedProject.application}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-[#D8D6D1]">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="w-full sm:w-auto px-5 py-2.5 text-xs text-[#414240] hover:text-[#111211] cursor-pointer"
                  >
                    Close Showcase
                  </button>
                  <button
                    onClick={() => {
                      const stoneName = selectedProject.stoneUsed.split('&')[0].trim();
                      onSelectProjectForQuote(stoneName, selectedProject.application);
                      setSelectedProject(null);
                    }}
                    className="w-full sm:w-auto px-6 py-3 bg-[#111211] hover:bg-[#414240] text-[#F4F3EF] font-bold text-xs tracking-[0.2em] uppercase rounded-sm cursor-pointer border border-[#111211] shadow-md transition-all hover:-translate-y-0.5"
                  >
                    REQUEST SIMILAR SPECIFICATION
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
