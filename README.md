<div align="center">

# 🎯 Taskero

### Modern Task Management System with Real-time Updates

<p align="center">
  <img src="![KanbanPage](https://github.com/user-attachments/assets/26dd7592-7aeb-4560-96db-874abcb9fb61)" alt="Dashboard" width="800"/>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#supabase-setup">Supabase Setup</a> •
  <a href="#usage">Usage</a> •
  <a href="#contributing">Contributing</a>
</p>

<p align="center">
  <img alt="GitHub" src="https://img.shields.io/github/license/sefagur/taskero?color=blue">
  <img alt="GitHub stars" src="https://img.shields.io/github/stars/sefagur/taskero">
  <img alt="GitHub issues" src="https://img.shields.io/github/issues/sefagur/taskero">
</p>

</div>

## ✨ Features

<div align="center">
  <img src="![RegisterPage](https://github.com/user-attachments/assets/52a21c8e-9c0b-46e2-9e1d-d437b0ef5585)" alt="Features" width="800"/>
</div>

### 🔐 Authentication
- Email/Password registration and login
- Secure profile management
- Session handling

### 📋 Task Management
- Interactive Kanban board with drag-and-drop
- Rich task details and descriptions
- Image attachments
- Priority levels
- Due date tracking
- Status management

### 🎨 Modern UI/UX
- Dark theme design
- Responsive layout
- Smooth animations
- Real-time updates

<div align="center">
  <img src="![MobilePage](https://github.com/user-attachments/assets/1bf5a158-18bb-45ad-86dd-d0bed719f1ee)" alt="Mobile View" width="300"/>
  <p><em>Responsive Mobile View</em></p>
</div>

## 🚀 Tech Stack

### Frontend
- ⚛️ React.js
- 🎨 Tailwind CSS
- 🛣️ React Router v6
- 🎯 React Beautiful DnD
- 🔔 React Toastify

### Backend
- 🔥 Supabase
- 📊 PostgreSQL
- 🔒 Row Level Security
- ⚡ Real-time subscriptions

## 📦 Installation

1. **Clone & Install**
```bash
# Clone the repository
git clone https://github.com/sefagur/taskero.git

# Navigate to project
cd taskero

# Install dependencies
npm install
```

2. **Environment Setup**
```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. **Start Development**
```bash
npm start
```

<div align="center">
  <img src="![TaskModal](https://github.com/user-attachments/assets/dedb3306-2532-4302-9bb0-33116ff4b7be)" alt="Setup Guide" width="600"/>
  <p><em>Visual Setup Guide</em></p>
</div>

## 🛠️ Supabase Setup

### 1. Database Tables

<details>
<summary>📊 Profiles Table</summary>

```sql
create table profiles (
  id uuid references auth.users on delete cascade,
  name text,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);
```
</details>

<details>
<summary>📋 Tasks Table</summary>

```sql
create table tasks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade,
  title text not null,
  description text,
  status text default 'todo',
  priority text default 'medium',
  due_date timestamp with time zone,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```
</details>

### 2. Security Policies

<details>
<summary>🔒 RLS Policies</summary>

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE USING (auth.uid() = id);

-- Tasks policies
CREATE POLICY "Tasks are viewable by owner"
ON tasks FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Tasks are insertable by owner"
ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Tasks are updatable by owner"
ON tasks FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Tasks are deletable by owner"
ON tasks FOR DELETE USING (auth.uid() = user_id);
```
</details>

### 3. Storage Setup

<details>
<summary>📁 Storage Configuration</summary>

```sql
-- Create and configure task-images bucket
CREATE POLICY "Images are accessible to owner"
ON storage.objects FOR SELECT
USING (auth.uid() = owner);

CREATE POLICY "Anyone can upload an image"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'task-images');
```
</details>

## ⚙️ Supabase Setup

1. Create a Supabase account at [https://supabase.com](https://supabase.com)

2. Create a new project and get your credentials:
   - Project URL
   - Anon Public Key

3. Create the following tables in your Supabase database:

```sql
-- Create a table for tasks
create table tasks (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  status text default 'todo',
  priority text default 'medium',
  user_id uuid references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  due_date timestamp with time zone
);

-- Enable Row Level Security (RLS)
alter table tasks enable row level security;

-- Create policy to allow users to see only their tasks
create policy "Users can view their own tasks" on tasks
  for select using (auth.uid() = user_id);

-- Create policy to allow users to insert their own tasks
create policy "Users can insert their own tasks" on tasks
  for insert with check (auth.uid() = user_id);

-- Create policy to allow users to update their own tasks
create policy "Users can update their own tasks" on tasks
  for update using (auth.uid() = user_id);

-- Create policy to allow users to delete their own tasks
create policy "Users can delete their own tasks" on tasks
  for delete using (auth.uid() = user_id);
```

4. Create a `.env` file in the root directory:
```env
REACT_APP_SUPABASE_URL=your_project_url
REACT_APP_SUPABASE_ANON_KEY=your_anon_public_key
```

## 🎮 Usage

1. Start the development server:
```bash
npm start
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

3. Register a new account or login with existing credentials

4. Start managing your tasks!

## 📱 Project Structure

```
react-supabase-kanban/
├── public/                # Static files
├── src/                   # Source files
│   ├── components/        # Reusable components
│   │   ├── AuthBanner.js  # Authentication banner
│   │   ├── DeleteModal.js # Delete confirmation modal
│   │   ├── Layout.js      # Main layout component
│   │   ├── TaskCard.js    # Individual task card
│   │   └── TaskModal.js   # Task creation/edit modal
│   ├── pages/            # Page components
│   │   ├── Dashboard.js   # Main dashboard page
│   │   ├── Login.js       # Login page
│   │   └── Register.js    # Registration page
│   ├── App.js            # Main application component
│   ├── index.js          # Application entry point
│   ├── index.css         # Global styles
│   └── supabaseClient.js # Supabase configuration
├── .env                  # Environment variables
├── .gitignore           # Git ignore file
├── package.json         # Project dependencies
├── README.md           # Project documentation
└── tailwind.config.js  # Tailwind CSS configuration
```

## 🎨 Customization

### Theme Configuration
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'brand-primary': '#7C3AED',
        'dark-primary': '#1F2937',
        // ... more colors
      }
    }
  }
}
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Supabase](https://supabase.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Beautiful DnD](https://github.com/atlassian/react-beautiful-dnd)

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/sefagur">Sefa GÜR</a></p>
  
  <a href="https://github.com/sefagur">
    <img src="https://img.shields.io/github/followers/sefagur?label=Follow&style=social" alt="GitHub followers"/>
  </a>
</div>
