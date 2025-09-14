import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Upload, Download, FileSpreadsheet, Users } from "lucide-react";
import { generateHldExcel } from "@/lib/excelGenerator";
import { useToast } from "@/hooks/use-toast";

interface HldData {
  sectionId: string;
  sectionName: string;
  author: string;
  reviewer: string;
  createDate: string;
  updateDate: string;
  approvalDate: string;
  changeOverview: string;
  objective: string;
  assumptions: string;
  constraints: string;
  dependencies: string;
  risk: string;
  systemArchDetails: string;
  componentDetails: string;
  requirements: string;
  design: string;
  impact: string;
  outputPayload: string;
  test1: string;
  designFiles: File[];
}

const HldGenerator = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<HldData>({
    sectionId: "",
    sectionName: "",
    author: "",
    reviewer: "",
    createDate: "",
    updateDate: "",
    approvalDate: "",
    changeOverview: "",
    objective: "",
    assumptions: "",
    constraints: "",
    dependencies: "",
    risk: "",
    systemArchDetails: "",
    componentDetails: "",
    requirements: "",
    design: "",
    impact: "",
    outputPayload: "",
    test1: "",
    designFiles: [],
  });

  const handleInputChange = (field: keyof HldData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({
      ...prev,
      designFiles: [...prev.designFiles, ...files]
    }));
    toast({
      title: "Files uploaded",
      description: `${files.length} file(s) added for Design Implementation`,
    });
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      designFiles: prev.designFiles.filter((_, i) => i !== index)
    }));
  };

  const handleGenerate = async () => {
    try {
      await generateHldExcel(formData);
      toast({
        title: "HLD Generated Successfully",
        description: "Your HLD document has been downloaded as an Excel file",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Please check all required fields and try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex justify-center items-center gap-3 mb-4">
            <FileSpreadsheet className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              HLD Document Generator
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Automate your High-Level Design documentation process. Generate professionally styled Excel documents in minutes.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Basic Information */}
          <Card className="shadow-card animate-slide-up">
            <CardHeader className="bg-gradient-to-r from-orange-light/20 to-orange-light/10 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="sectionId">Section ID</Label>
                  <Input
                    id="sectionId"
                    value={formData.sectionId}
                    onChange={(e) => handleInputChange('sectionId', e.target.value)}
                    placeholder="e.g., D204_4-8"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sectionName">Section Name</Label>
                  <Input
                    id="sectionName"
                    value={formData.sectionName}
                    onChange={(e) => handleInputChange('sectionName', e.target.value)}
                    placeholder="e.g., Product section"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => handleInputChange('author', e.target.value)}
                    placeholder="Developer name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reviewer">Reviewer</Label>
                  <Input
                    id="reviewer"
                    value={formData.reviewer}
                    onChange={(e) => handleInputChange('reviewer', e.target.value)}
                    placeholder="Reviewer name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="createDate">Create Date</Label>
                  <Input
                    id="createDate"
                    type="date"
                    value={formData.createDate}
                    onChange={(e) => handleInputChange('createDate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="updateDate">Update Date</Label>
                  <Input
                    id="updateDate"
                    type="date"
                    value={formData.updateDate}
                    onChange={(e) => handleInputChange('updateDate', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Overview */}
          <Card className="shadow-card animate-slide-up">
            <CardHeader className="bg-gradient-to-r from-green-light/20 to-green-light/10 rounded-t-lg">
              <CardTitle>Project Overview</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="changeOverview">Change Overview</Label>
                <Textarea
                  id="changeOverview"
                  value={formData.changeOverview}
                  onChange={(e) => handleInputChange('changeOverview', e.target.value)}
                  placeholder="Describe the changes being made..."
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="objective">Objective</Label>
                <Textarea
                  id="objective"
                  value={formData.objective}
                  onChange={(e) => handleInputChange('objective', e.target.value)}
                  placeholder="Define the main objectives..."
                  className="min-h-[120px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Design Considerations */}
          <Card className="shadow-card animate-slide-up">
            <CardHeader className="bg-gradient-to-r from-orange-light/20 to-orange-light/10 rounded-t-lg">
              <CardTitle>Design Considerations</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="assumptions">Assumptions</Label>
                  <Textarea
                    id="assumptions"
                    value={formData.assumptions}
                    onChange={(e) => handleInputChange('assumptions', e.target.value)}
                    placeholder="List assumptions..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="constraints">Constraints</Label>
                  <Textarea
                    id="constraints"
                    value={formData.constraints}
                    onChange={(e) => handleInputChange('constraints', e.target.value)}
                    placeholder="List constraints..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dependencies">Dependencies</Label>
                  <Textarea
                    id="dependencies"
                    value={formData.dependencies}
                    onChange={(e) => handleInputChange('dependencies', e.target.value)}
                    placeholder="List dependencies..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="risk">Risk</Label>
                  <Textarea
                    id="risk"
                    value={formData.risk}
                    onChange={(e) => handleInputChange('risk', e.target.value)}
                    placeholder="Identify risks..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Architecture */}
          <Card className="shadow-card animate-slide-up">
            <CardHeader className="bg-gradient-to-r from-orange-light/20 to-orange-light/10 rounded-t-lg">
              <CardTitle>Architecture</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="systemArchDetails">System Architecture Details</Label>
                  <Textarea
                    id="systemArchDetails"
                    value={formData.systemArchDetails}
                    onChange={(e) => handleInputChange('systemArchDetails', e.target.value)}
                    placeholder="Describe system architecture..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="componentDetails">Component Details</Label>
                  <Textarea
                    id="componentDetails"
                    value={formData.componentDetails}
                    onChange={(e) => handleInputChange('componentDetails', e.target.value)}
                    placeholder="Describe component details..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Design/Analysis */}
          <Card className="shadow-card animate-slide-up">
            <CardHeader className="bg-gradient-to-r from-orange-light/20 to-orange-light/10 rounded-t-lg">
              <CardTitle>Design/Analysis</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  placeholder="Detail the requirements..."
                  className="min-h-[120px]"
                />
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="design">Design Implementation</Label>
                  <Textarea
                    id="design"
                    value={formData.design}
                    onChange={(e) => handleInputChange('design', e.target.value)}
                    placeholder="Describe the design implementation..."
                    className="min-h-[120px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="designFiles">Design Files (Images, Code, References)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Upload source code, images, or reference files
                    </p>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept=".jpg,.jpeg,.png,.gif,.pdf,.txt,.js,.ts,.jsx,.tsx,.py,.java,.cpp,.cs"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      Choose Files
                    </Button>
                  </div>
                  {formData.designFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium">Uploaded Files:</p>
                      {formData.designFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                          <span className="text-sm">{file.name}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFile(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="impact">Impact</Label>
                  <Textarea
                    id="impact"
                    value={formData.impact}
                    onChange={(e) => handleInputChange('impact', e.target.value)}
                    placeholder="Describe the impact..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="outputPayload">Output Payload</Label>
                  <Textarea
                    id="outputPayload"
                    value={formData.outputPayload}
                    onChange={(e) => handleInputChange('outputPayload', e.target.value)}
                    placeholder="Define output payload..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Testing */}
          <Card className="shadow-card animate-slide-up">
            <CardHeader className="bg-gradient-to-r from-orange-light/20 to-orange-light/10 rounded-t-lg">
              <CardTitle>Testing</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-2">
                <Label htmlFor="test1">Test Cases & Scenarios</Label>
                <Textarea
                  id="test1"
                  value={formData.test1}
                  onChange={(e) => handleInputChange('test1', e.target.value)}
                  placeholder="Describe test cases and scenarios..."
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Generate Button */}
          <div className="text-center pt-8">
            <Button
              onClick={handleGenerate}
              size="lg"
              className="bg-gradient-primary hover:shadow-elegant transition-all duration-300 text-lg px-8 py-6 rounded-xl"
            >
              <Download className="mr-2 h-5 w-5" />
              Generate HLD Excel Document
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HldGenerator;