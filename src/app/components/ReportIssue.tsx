import { useState } from 'react';
import { Camera, MapPin, Send, AlertCircle, WifiOff } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Switch } from '@/app/components/ui/switch';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { Issue, IssueCategory, User, Location } from '@/utils/types';
import { addIssue, addPendingReport, getCurrentUser } from '@/utils/storage';
import { generateAIInsights } from '@/utils/ai';
import { toast } from 'sonner';
import LocationSelector from '@/app/components/LocationSelector';
import { useLanguage } from '@/contexts/LanguageContext';

interface ReportIssueProps {
  onSubmitSuccess: () => void;
  allIssues: Issue[];
}

const categories: { value: IssueCategory; label: string }[] = [
  { value: 'roads', label: 'Roads & Pavements' },
  { value: 'water', label: 'Water Supply' },
  { value: 'electricity', label: 'Electricity' },
  { value: 'sanitation', label: 'Sanitation & Waste' },
  { value: 'street-lights', label: 'Street Lights' },
  { value: 'drainage', label: 'Drainage & Sewage' },
  { value: 'public-transport', label: 'Public Transport' },
  { value: 'parks', label: 'Parks & Recreation' },
  { value: 'other', label: 'Other' },
];

export default function ReportIssue({ onSubmitSuccess, allIssues }: ReportIssueProps) {
  const { t } = useLanguage();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IssueCategory>('other');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [location, setLocation] = useState<Location>({
    lat: 28.6139,
    lng: 77.2090,
    address: 'Connaught Place, New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
  });
  const [isOffline, setIsOffline] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentUser = getCurrentUser();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const userId = isAnonymous ? `anon-${Date.now()}` : (currentUser?.id || `user-${Date.now()}`);
      const userName = isAnonymous ? 'Anonymous' : (currentUser?.name || 'Citizen User');

      const newIssue: Issue = {
        id: `issue-${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        category,
        location,
        status: 'submitted',
        imageUrl: imagePreview || undefined,
        userId,
        userName,
        isAnonymous,
        upvotes: 0,
        downvotes: 0,
        votedBy: [],
        comments: [],
        timeline: [
          {
            id: `timeline-${Date.now()}`,
            issueId: `issue-${Date.now()}`,
            type: 'created',
            description: `Issue reported by ${userName}`,
            timestamp: Date.now(),
            userId,
            userName,
          },
        ],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        department: '',
      };

      // Generate AI insights
      newIssue.aiInsights = generateAIInsights(newIssue, allIssues);
      newIssue.department = newIssue.aiInsights.suggestedDepartment;

      // Check if offline
      if (isOffline) {
        addPendingReport(newIssue);
        toast.success('Report saved offline. Will sync when online.');
      } else {
        addIssue(newIssue);
        toast.success('Issue reported successfully!');
        
        // Show duplicate warning if needed
        if (newIssue.aiInsights.duplicateScore > 0.6) {
          toast.warning(`AI detected ${Math.round(newIssue.aiInsights.duplicateScore * 100)}% similarity with existing issues`);
        }
      }

      // Reset form
      setTitle('');
      setDescription('');
      setCategory('other');
      setImageFile(null);
      setImagePreview('');
      setIsAnonymous(false);

      setTimeout(() => {
        onSubmitSuccess();
      }, 1000);
    } catch (error) {
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <AlertCircle className="mr-2 h-6 w-6 text-blue-600" />
        Report a Civic Issue
      </h2>

      {isOffline && (
        <Alert className="mb-6 bg-amber-50 border-amber-200">
          <WifiOff className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            You're in offline mode. Your report will be saved locally and synced when you're back online.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <Label htmlFor="title">Issue Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Brief description of the issue"
            required
            className="mt-1"
          />
        </div>

        {/* Category */}
        <div>
          <Label htmlFor="category">Category *</Label>
          <Select value={category} onValueChange={(value) => setCategory(value as IssueCategory)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Detailed Description *</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide detailed information about the issue..."
            rows={5}
            required
            className="mt-1"
          />
        </div>

        {/* Location */}
        <div>
          <Label htmlFor="location">Location *</Label>
          <LocationSelector
            location={location}
            setLocation={setLocation}
          />
        </div>

        {/* Image Upload */}
        <div>
          <Label htmlFor="image">Upload Image (Optional)</Label>
          <div className="mt-1">
            <label className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="h-full object-contain" />
              ) : (
                <span className="flex items-center space-x-2">
                  <Camera className="h-6 w-6 text-gray-400" />
                  <span className="text-gray-600">Click to upload image</span>
                </span>
              )}
              <input
                id="image"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>

        {/* Anonymous Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <Label htmlFor="anonymous" className="text-base font-medium">
              Report Anonymously
            </Label>
            <p className="text-sm text-gray-500">
              Your identity will not be visible to other users
            </p>
          </div>
          <Switch
            id="anonymous"
            checked={isAnonymous}
            onCheckedChange={setIsAnonymous}
          />
        </div>

        {/* Offline Mode Toggle (Demo) */}
        <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
          <div>
            <Label htmlFor="offline" className="text-base font-medium">
              Simulate Offline Mode
            </Label>
            <p className="text-sm text-gray-500">
              Test offline-first functionality
            </p>
          </div>
          <Switch
            id="offline"
            checked={isOffline}
            onCheckedChange={setIsOffline}
          />
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full" 
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            'Submitting...'
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              Submit Report
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}