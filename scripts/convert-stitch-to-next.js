#!/usr/bin/env node
/**
 * Stitch HTML to Next.js TSX Converter
 */

import fs from 'fs';
import path from 'path';

const STITCH_DIR = '/Users/anderskristiansen/Downloads/stitch_heritage_grid_design_system';
const OUTPUT_DIR = '/Users/anderskristiansen/Developer/akgolf/akgolf-platform/app/stitch-screens';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ICON_MAPPING = {
  'arrow_forward': 'ArrowRight',
  'arrow_back': 'ArrowLeft',
  'menu': 'Menu',
  'close': 'X',
  'dashboard': 'LayoutDashboard',
  'military_tech': 'Trophy',
  'workspace_premium': 'Crown',
  'schedule': 'Calendar',
  'analytics': 'BarChart3',
  'settings': 'Settings',
  'person': 'User',
  'groups': 'Users',
  'sports': 'Activity',
  'fitness_center': 'Dumbbell',
  'timer': 'Clock',
  'trending_up': 'TrendingUp',
  'notifications': 'Bell',
  'search': 'Search',
  'chevron_right': 'ChevronRight',
  'chevron_left': 'ChevronLeft',
  'expand_more': 'ChevronDown',
  'star': 'Star',
  'favorite': 'Heart',
  'visibility': 'Eye',
  'refresh': 'RefreshCw',
  'download': 'Download',
  'upload': 'Upload',
  'share': 'Share2',
  'email': 'Mail',
  'phone': 'Phone',
  'location': 'MapPin',
  'flag': 'Flag',
  'emoji_events': 'Award',
  'school': 'School',
  'self_improvement': 'Sparkles',
};

function extractBodyContent(html) {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  return bodyMatch ? bodyMatch[1].trim() : html;
}

function convertToTSX(folderName, htmlContent) {
  const componentName = folderName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  
  const bodyContent = extractBodyContent(htmlContent);
  
  // Enkel konvertering
  let jsxContent = bodyContent
    .replace(/class=/g, 'className=')
    .replace(/for=/g, 'htmlFor=')
    .replace(/<!--/g, '{/*')
    .replace(/-->/g, '*/}');
  
  return `"use client";

import React from "react";
import { LayoutDashboard, Trophy, Crown, Calendar, BarChart3, Settings, User, Users, Activity, Clock, TrendingUp, Bell, Search, ArrowRight, ChevronRight, Star, Heart, MapPin, Award, School, Sparkles } from "lucide-react";

export default function ${componentName}() {
  return (
    <div className="min-h-screen bg-[#0A0D0A] text-[#F5F1E8]">
      ${jsxContent}
    </div>
  );
}
`;
}

function processStitchFolder() {
  if (!fs.existsSync(STITCH_DIR)) {
    console.error('Stitch directory not found:', STITCH_DIR);
    process.exit(1);
  }
  
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  const folders = fs.readdirSync(STITCH_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  console.log('Found', folders.length, 'Stitch folders');
  
  folders.slice(0, 5).forEach(folder => { // Konverter bare 5 først
    const codePath = path.join(STITCH_DIR, folder, 'code.html');
    
    if (!fs.existsSync(codePath)) {
      console.log('Skipping', folder, '(no code.html)');
      return;
    }
    
    try {
      const html = fs.readFileSync(codePath, 'utf-8');
      const tsx = convertToTSX(folder, html);
      
      const componentDir = path.join(OUTPUT_DIR, folder);
      if (!fs.existsSync(componentDir)) {
        fs.mkdirSync(componentDir, { recursive: true });
      }
      
      const outputPath = path.join(componentDir, 'page.tsx');
      fs.writeFileSync(outputPath, tsx);
      
      console.log('Converted:', folder);
    } catch (err) {
      console.error('Error converting', folder, ':', err.message);
    }
  });
  
  console.log('\\nOutput directory:', OUTPUT_DIR);
}

processStitchFolder();
