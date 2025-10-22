/**
 * Certifications Page
 * Main page component that composes all sub-components
 */

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SearchBar } from "@/components/certifications/SearchBar";
import { type Certification } from "@/lib/types/certifications";
import { useCertificationsPage } from "./hooks/useCertificationsPage";
import { useRealtimeUpdates } from "./hooks/useRealtimeUpdates";
import { createAuthGuard } from "./utils/helpers";
import {
  PageHeader,
  FiltersSection,
  ResultsHeader,
  CertificationsGrid,
  CertificationDialogs,
  LoadingState,
  ErrorState,
} from "./components";

const CertificationsPage = () => {
  // Get all state and handlers from custom hook
  const {
    // State
    searchQuery,
    debouncedSearch,
    selectedCategory,
    viewMode,
    certs,
    isAddDialogOpen,
    editingCertification,
    
    // Computed
    isAdmin,
    profile,
    loading,
    error,
    
    // Data
    categories,
    favoriteIds,
    takersCount,
    deletingId,
    
    // Actions
    setSearchQuery,
    setSelectedCategory,
    setViewMode,
    setCerts,
    setIsAddDialogOpen,
    setEditingCertification,
    
    // Operations
    toggleFavorite,
    createCertification,
    updateCertification,
    deleteCertification,
    
    // Navigation
    navigate,
    toast,
  } = useCertificationsPage();

  // Setup realtime updates
  useRealtimeUpdates({ toast });

  // Create auth guard
  const requireAuth = createAuthGuard(profile?.id, () => {
    toast({
      title: "Please sign in",
      description: "Create an account to view details.",
    });
    navigate("/auth");
  });

  // Event handlers
  const handleDeleteClick = async (id: string, title: string) => {
    const { error } = await deleteCertification(id);
    if (!error) {
      setCerts((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleToggleFavorite = async (certification: Certification) => {
    await toggleFavorite(certification.id);
  };

  const handleNavigateToDetail = (certId: string) => {
    requireAuth(() => navigate(`/certifications/${certId}`));
  };

  // Loading and error states
  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001d3d] via-[#003566] to-[#000814] text-gray-100">
      <Header />

      <main className="container mx-auto px-6 py-12 md:py-16">
        {/* Page Header */}
        <PageHeader />

        {/* Search Bar */}
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        {/* Categories and Filters */}
        <FiltersSection
          selectedCategory={selectedCategory}
          categories={categories}
          isAdmin={isAdmin}
          onCategoryChange={setSelectedCategory}
          onAddClick={() => setIsAddDialogOpen(true)}
          onManageClick={() => navigate("/settings")}
        />

        {/* Results Header and View Toggle */}
        <ResultsHeader
          count={certs.length}
          searchQuery={debouncedSearch}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Certifications Grid/List */}
        <CertificationsGrid
          certifications={certs}
          viewMode={viewMode}
          isAdmin={isAdmin}
          favoriteIds={favoriteIds}
          takersCount={takersCount}
          deletingId={deletingId}
          userAuthenticated={!!profile?.id}
          onEdit={setEditingCertification}
          onDelete={handleDeleteClick}
          onToggleFavorite={handleToggleFavorite}
          onNavigateToDetail={handleNavigateToDetail}
        />
      </main>

      <Footer />

      {/* Dialogs */}
      <CertificationDialogs
        isAddDialogOpen={isAddDialogOpen}
        editingCertification={editingCertification}
        categories={categories}
        onAddDialogChange={setIsAddDialogOpen}
        onEditDialogChange={(open) => !open && setEditingCertification(null)}
        onCreate={createCertification}
        onUpdate={updateCertification}
      />
    </div>
  );
};

export default CertificationsPage;
