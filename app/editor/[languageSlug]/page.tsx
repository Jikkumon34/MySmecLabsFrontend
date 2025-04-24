  'use client';

import UnifiedCodeEditor from '@/components/Library/UnifiedCodeEditor';
import { useParams } from 'next/navigation';

  export default function CodeLanguageEditor() {
    const params = useParams();
    const languageSlug = params.languageSlug as string | undefined;
   

    return (
<UnifiedCodeEditor defaultLanguage={languageSlug} />
 
    );
  }