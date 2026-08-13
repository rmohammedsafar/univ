import React from 'react';
import CampusTour from './CampusTour';
import ResearchPapers from './ResearchPapers';
import UniversityBulletin from './UniversityBulletin';

export default function GalleryPage({ tourSlides, researchPapers, newsArticles }) {
  return (
    <main style={{ paddingTop: '100px' }}>
      <CampusTour tourSlides={tourSlides} />
      <ResearchPapers researchPapers={researchPapers} />
      <UniversityBulletin newsArticles={newsArticles} />
    </main>
  );
}
