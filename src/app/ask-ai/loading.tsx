import PageLoadingScreen from '@/components/PageLoadingScreen';

export default function AskAiLoading() {
  return (
    <PageLoadingScreen
      isVisible={true}
      message="Initializing 3D Neural Workstation & Spatial Models..."
    />
  );
}
