import React from 'react';
import { useState } from 'react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 px-6 py-3 flex justify-between items-center">
      {/* Logo和标题 */}
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="font-bold text-white">幻</span>
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          幻图
        </h1>
      </div>

      {/* 导航链接 - 桌面端 */}
      <div className="hidden md:flex items-center space-x-8">
        <a href="#" className="text-gray-300 hover:text-white transition-colors">首页</a>
        <a href="#" className="text-gray-300 hover:text-white transition-colors">探索</a>
        <a href="#" className="text-gray-300 hover:text-white transition-colors">API接入</a>
        <a href="#" className="text-gray-300 hover:text-white transition-colors">帮助</a>
      </div>

      {/* 右侧按钮组 */}
      <div className="flex items-center space-x-4">
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors hidden md:block">
          开始创作
        </button>

        {/* 用户头像 */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden border-2 border-gray-600"
          >
            <img
              src="https://i.pravatar.cc/150?img=33" // 示例头像
              alt="用户头像"
              className="w-full h-full object-cover"
            />
          </button>

          {/* 下拉菜单 */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 z-10">
              <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">个人中心</a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">我的作品</a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">账户设置</a>
              <div className="border-t border-gray-700 my-1"></div>
              <a href="#" className="block px-4 py-2 text-sm text-red-400 hover:bg-gray-700">退出登录</a>
            </div>
          )}
        </div>

        {/* 移动端菜单按钮 */}
        <button className="md:hidden text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;