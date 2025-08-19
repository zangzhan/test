import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  // 导航项数据
  const navItems = [
    {
      id: 'generate',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      label: '文生图'
    },
    {
      id: 'gallery',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      label: '作品画廊'
    },
    {
      id: 'history',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: '历史记录'
    },
  ];

  return (
    <aside className="bg-gray-900/80 backdrop-blur-md w-64 border-r border-gray-800 p-4 h-full flex flex-col">
      {/* 导航菜单 */}
      <nav className="flex-1 space-y-1">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
              activeTab === item.id
                ? 'bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-blue-400 border-l-4 border-blue-500'
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* 底部会员信息 */}
      <div className="mt-auto pt-4 border-t border-gray-800">
        <div className="p-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg text-center">
          <h3 className="text-sm font-medium text-gray-300 mb-1">升级到高级版</h3>
          <p className="text-xs text-gray-400 mb-3">解锁更多AI创作能力</p>
          <button className="w-full px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-medium transition-colors">
            立即升级
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;