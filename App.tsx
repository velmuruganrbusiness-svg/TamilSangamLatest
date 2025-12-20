
import React, { useState, useEffect } from 'react';
import { Footer } from './components/Footer';
import { Home } from './components/Home';
import { PostView } from './components/PostView';
import { Editor } from './components/Editor';
import { ClassicsView } from './components/ClassicsView';
import { PotikalView } from './components/PotikalView';
import { TamilKarkaView } from './components/TamilKarkaView';
import { LoginModal } from './components/LoginModal';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { mockApi } from './services/mockApi';
import { api as realApi } from './services/api';
import { Icon } from './components/Icon';
import type { Post, User, ClassicalWork, Category, Competition } from './types';
import type { Language } from './utils/translations';

type Page = 'home' | 'post' | 'editor' | 'classics' | 'category' | 'potikal' | 'karka' | 'author';
type Theme = 'light' | 'dark';

const USE_REAL_DB = false; 

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('home');
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedClassicalWorkId, setSelectedClassicalWorkId] = useState<string | null>(null);
  const [selectedAuthorId, setSelectedAuthorId] = useState<number | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [classicalWorks, setClassicalWorks] = useState<ClassicalWork[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>('ta');
  const [theme, setTheme] = useState<Theme>('light');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let fetchedPosts: Post[] = [];
        if (USE_REAL_DB) {
            fetchedPosts = await realApi.getPosts();
            if (fetchedPosts.length === 0) fetchedPosts = await mockApi.getPosts();
        } else {
            fetchedPosts = await mockApi.getPosts();
        }
        const [fetchedClassics, fetchedCompetitions] = await Promise.all([
            mockApi.getClassicalWorks(),
            mockApi.getCompetitions(),
        ]);
        setPosts(fetchedPosts);
        setClassicalWorks(fetchedClassics);
        setCompetitions(fetchedCompetitions);
      } catch (e) {
          console.error("Failed to load data", e);
      } finally {
          setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (newPage: Page, id: number | null = null, category: Category | null = null, workId: string | null = null) => {
    setPage(newPage);
    if (newPage === 'post') setSelectedPostId(id);
    if (newPage === 'category') setSelectedCategory(category);
    if (newPage === 'classics') setSelectedClassicalWorkId(workId);
    if (newPage === 'author') setSelectedAuthorId(id);
    setSidebarOpen(false);
    setSearchQuery('');
    window.scrollTo(0, 0);
  };
  
  const toggleSidebarCollapse = () => setIsSidebarCollapsed(prev => !prev);
  const handleSearch = (query: string) => setSearchQuery(query);
  const handleLogin = () => {
    setCurrentUser({ id: 1, name: 'வாசகர்', avatarUrl: 'https://ui-avatars.com/api/?name=User&background=be123c&color=fff' });
    setShowLoginModal(false);
  };
  const handleLogout = () => setCurrentUser(null);

  const handlePostSubmit = async (newPost: Omit<Post, 'id' | 'author' | 'likes' | 'comments' | 'createdAt'>) => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }
    const postData = { ...newPost, author: currentUser };
    if (USE_REAL_DB) {
        const savedPost = await realApi.createPost(postData);
        if (savedPost) {
            setPosts([savedPost, ...posts]);
            handleNavigate('home');
        }
    } else {
        const post: Post = { ...postData, id: Date.now(), likes: 0, comments: [], createdAt: new Date().toISOString() };
        await new Promise(r => setTimeout(r, 800));
        setPosts([post, ...posts]);
        handleNavigate('home');
    }
  };
  
  const toggleLanguage = () => setLanguage(l => l === 'ta' ? 'en' : 'ta');
  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  const renderContent = () => {
    const searchedPosts = posts.filter(post =>
      searchQuery
        ? post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    );

    switch (page) {
      case 'post':
        const post = posts.find(p => p.id == selectedPostId);
        return post ? <PostView post={post} onNavigate={handleNavigate} language={language} /> : <div className="text-center p-10">Post not found</div>;
      case 'editor':
        return <Editor onSubmit={handlePostSubmit} language={language} onNavigate={handleNavigate} />;
      case 'classics':
        return <ClassicsView works={classicalWorks} language={language} selectedWorkId={selectedClassicalWorkId} />;
      case 'potikal':
        return <PotikalView competitions={competitions} language={language} onNavigate={handleNavigate} />;
      case 'karka':
        return <TamilKarkaView language={language} onNavigate={handleNavigate} />;
      case 'category':
        return <Home posts={searchedPosts.filter(p => p.category === selectedCategory)} onNavigate={handleNavigate} category={selectedCategory} language={language} searchQuery={searchQuery} onSearch={handleSearch} currentUser={currentUser} isLoading={loading} />;
      case 'author':
        const authorPosts = searchedPosts.filter(p => p.author.id === selectedAuthorId);
        const authorDetails = authorPosts.length > 0 ? authorPosts[0].author : posts.find(p => p.author.id === selectedAuthorId)?.author;
        return <Home posts={authorPosts} onNavigate={handleNavigate} language={language} searchQuery={searchQuery} onSearch={handleSearch} currentUser={currentUser} isLoading={loading} selectedAuthor={authorDetails} />;
      case 'home':
      default:
        return <Home posts={searchedPosts} onNavigate={handleNavigate} language={language} searchQuery={searchQuery} onSearch={handleSearch} currentUser={currentUser} isLoading={loading} />;
    }
  };

  return (
    <div className="min-h-screen flex">
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden" onClick={() => setSidebarOpen(false)}></div>}
      
      <Sidebar
        onNavigate={handleNavigate}
        isOpen={sidebarOpen}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
        language={language}
      />
      
      <div className={`flex flex-col flex-1 min-w-0 transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <Header 
          currentUser={currentUser}
          onLoginClick={() => setShowLoginModal(true)}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          language={language}
          theme={theme}
          onToggleLanguage={toggleLanguage}
          onToggleTheme={toggleTheme}
        />

        <div className="md:hidden h-14 border-b border-[#3e2b22] bg-[#2b1d16] flex items-center px-4 justify-between">
            <button onClick={() => setSidebarOpen(true)} className="p-2 text-[#d6cbb8]"><Icon name="expand" /></button>
            <div className="text-rose-500"><Icon name="brand-logo" /></div>
            <div className="w-10"></div>
        </div>

        <main className="flex-grow p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
             {renderContent()}
          </div>
        </main>
        <Footer language={language} />
      </div>

      {showScrollTop && (
        <button onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="fixed bottom-6 right-6 p-3 rounded-full bg-rose-600 text-white shadow-xl hover:bg-rose-700 transition-all z-50 flex items-center justify-center">
          <Icon name="arrow-up" />
        </button>
      )}

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} onLogin={handleLogin} language={language} />}
    </div>
  );
};

export default App;
