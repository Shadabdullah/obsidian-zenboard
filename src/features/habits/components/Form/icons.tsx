import {
  // Health & Fitness
  Activity,
  Heart,
  HeartHandshake,
  Weight,
  Timer,
  Zap,
  Dumbbell,

  // Food & Drink
  Coffee,
  Apple,
  Cake,
  Droplets,

  // Education & Learning
  Book,
  BookOpen,
  Edit,
  FileText,
  GraduationCap,
  PenTool,

  // Productivity
  CheckSquare,
  Square,
  CheckCircle,
  Calendar,
  Clock,
  AlarmClock,

  // Wellness & Mindfulness
  Smile,
  Laugh,
  Moon,
  Sun,
  Brain,
  Bike,
  Waves,

  // Finance
  DollarSign,
  Plus,
  Coins,
  Wallet,

  // Technology
  Smartphone,
  Laptop,
  Gamepad2,
  Headphones,

  // Daily Activities
  Home,
  Car,
  Paintbrush,
  ShoppingBag,
  Camera,
  Music,

  // Nature & Environment
  Flower,
  Cloud,

  // Goals & Achievement
  Trophy,
  Medal,
  Star,
  Award,
  Target,

  // Communication
  Phone,
  MessageSquare,
  Users,
  UserPlus,

  // Creative
  Palette,
  Music2,
  Video,
  Mic,
} from "lucide-react";

// Habit icons array with categories
const habitIcons = [
  // Health & Fitness
  { name: "Activity", icon: Activity, category: "Health & Fitness" },
  { name: "Heart", icon: Heart, category: "Health & Fitness" },
  {
    name: "HeartHandshake",
    icon: HeartHandshake,
    category: "Health & Fitness",
  },
  { name: "Weight", icon: Weight, category: "Health & Fitness" },
  { name: "Timer", icon: Timer, category: "Health & Fitness" },
  { name: "Zap", icon: Zap, category: "Health & Fitness" },
  { name: "Dumbbell", icon: Dumbbell, category: "Health & Fitness" },
  { name: "Bike", icon: Bike, category: "Health & Fitness" },
  { name: "Waves", icon: Waves, category: "Health & Fitness" },

  // Food & Drink
  { name: "Coffee", icon: Coffee, category: "Food & Drink" },
  { name: "Apple", icon: Apple, category: "Food & Drink" },
  { name: "Cake", icon: Cake, category: "Food & Drink" },
  { name: "Droplets", icon: Droplets, category: "Food & Drink" },

  // Education & Learning
  { name: "Book", icon: Book, category: "Education & Learning" },
  { name: "BookOpen", icon: BookOpen, category: "Education & Learning" },
  { name: "Edit", icon: Edit, category: "Education & Learning" },
  { name: "FileText", icon: FileText, category: "Education & Learning" },
  {
    name: "GraduationCap",
    icon: GraduationCap,
    category: "Education & Learning",
  },
  { name: "PenTool", icon: PenTool, category: "Education & Learning" },

  // Productivity
  { name: "CheckSquare", icon: CheckSquare, category: "Productivity" },
  { name: "Square", icon: Square, category: "Productivity" },
  { name: "CheckCircle", icon: CheckCircle, category: "Productivity" },
  { name: "Calendar", icon: Calendar, category: "Productivity" },
  { name: "Clock", icon: Clock, category: "Productivity" },
  { name: "AlarmClock", icon: AlarmClock, category: "Productivity" },
  { name: "Target", icon: Target, category: "Productivity" },

  // Wellness & Mindfulness
  { name: "Smile", icon: Smile, category: "Wellness & Mindfulness" },
  { name: "Laugh", icon: Laugh, category: "Wellness & Mindfulness" },
  { name: "Moon", icon: Moon, category: "Wellness & Mindfulness" },
  { name: "Sun", icon: Sun, category: "Wellness & Mindfulness" },
  { name: "Brain", icon: Brain, category: "Wellness & Mindfulness" },

  // Finance
  { name: "DollarSign", icon: DollarSign, category: "Finance" },
  { name: "Plus", icon: Plus, category: "Finance" },
  { name: "Coins", icon: Coins, category: "Finance" },
  { name: "Wallet", icon: Wallet, category: "Finance" },

  // Technology
  { name: "Smartphone", icon: Smartphone, category: "Technology" },
  { name: "Laptop", icon: Laptop, category: "Technology" },
  { name: "Gamepad2", icon: Gamepad2, category: "Technology" },
  { name: "Headphones", icon: Headphones, category: "Technology" },

  // Daily Activities
  { name: "Home", icon: Home, category: "Daily Activities" },
  { name: "Car", icon: Car, category: "Daily Activities" },
  { name: "Paintbrush", icon: Paintbrush, category: "Daily Activities" },
  { name: "ShoppingBag", icon: ShoppingBag, category: "Daily Activities" },
  { name: "Camera", icon: Camera, category: "Daily Activities" },
  { name: "Music", icon: Music, category: "Daily Activities" },

  // Goals & Achievement
  { name: "Trophy", icon: Trophy, category: "Goals & Achievement" },
  { name: "Medal", icon: Medal, category: "Goals & Achievement" },
  { name: "Star", icon: Star, category: "Goals & Achievement" },
  { name: "Award", icon: Award, category: "Goals & Achievement" },

  // Communication
  { name: "Phone", icon: Phone, category: "Communication" },
  { name: "MessageSquare", icon: MessageSquare, category: "Communication" },
  { name: "Users", icon: Users, category: "Communication" },
  { name: "UserPlus", icon: UserPlus, category: "Communication" },

  // Creative
  { name: "Palette", icon: Palette, category: "Creative" },
  { name: "Music2", icon: Music2, category: "Creative" },
  { name: "Video", icon: Video, category: "Creative" },
  { name: "Mic", icon: Mic, category: "Creative" },

  // Nature & Environment
  { name: "Flower", icon: Flower, category: "Nature & Environment" },
  { name: "Cloud", icon: Cloud, category: "Nature & Environment" },
];

export default habitIcons;
