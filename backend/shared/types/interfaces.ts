// Core type definitions for Drishya-Code backend services

export type ProgrammingLanguage = 'python' | 'java' | 'javascript' | 'cpp';
export type VernacularLanguage = 'hindi' | 'hinglish' | 'marathi' | 'english';
export type FlowElementType = 'start' | 'process' | 'decision' | 'loop' | 'function' | 'end';
export type ErrorType = 'syntax' | 'logic' | 'runtime';
export type ErrorSeverity = 'error' | 'warning' | 'info';

// Code Analysis Interfaces
export interface CodeAnalysisRequest {
  code: string;
  language: ProgrammingLanguage;
  userId: string;
}

export interface CodeAnalysisResponse {
  ast: AbstractSyntaxTree;
  flowElements: FlowElement[];
  errors: CodeError[];
  complexity: ComplexityMetrics;
}

export interface FlowElement {
  id: string;
  type: FlowElementType;
  content: string;
  codeLines: number[];
  children: string[];
  metadata: ElementMetadata;
}

export interface AbstractSyntaxTree {
  language: string;
  rootNode: ASTNode;
  metadata: ASTMetadata;
}

export interface ASTNode {
  type: string;
  value?: any;
  children: ASTNode[];
  position: SourcePosition;
  semanticInfo: SemanticInfo;
}

export interface SourcePosition {
  line: number;
  column: number;
  endLine: number;
  endColumn: number;
}

export interface SemanticInfo {
  scope?: string;
  variables?: string[];
  functions?: string[];
}

export interface ElementMetadata {
  complexity: number;
  nestingLevel: number;
  [key: string]: any;
}

export interface ASTMetadata {
  totalLines: number;
  totalNodes: number;
  [key: string]: any;
}

export interface CodeError {
  line: number;
  column: number;
  message: string;
  type: ErrorType;
  severity: ErrorSeverity;
}

export interface ComplexityMetrics {
  cyclomaticComplexity: number;
  cognitiveComplexity: number;
  linesOfCode: number;
}

// Visualization Interfaces
export interface VisualizationRequest {
  flowElements: FlowElement[];
  preferences: VisualizationPreferences;
}

export interface VisualizationResponse {
  mermaidSyntax: string;
  elementMapping: ElementMapping[];
  interactionPoints: InteractionPoint[];
}

export interface VisualizationPreferences {
  theme: 'light' | 'dark' | 'cultural';
  complexity: 'simplified' | 'detailed';
  language: VernacularLanguage;
}

export interface ElementMapping {
  elementId: string;
  mermaidNodeId: string;
  codeLines: number[];
}

export interface InteractionPoint {
  elementId: string;
  type: 'click' | 'hover';
  action: string;
}

// AI Tutor Interfaces
export interface TutorRequest {
  flowElement: FlowElement;
  context: CodeContext;
  language: VernacularLanguage;
  explanationLevel: 'beginner' | 'intermediate' | 'advanced';
}

export interface TutorResponse {
  explanation: string;
  culturalAnalogies: string[];
  keyTerms: TermDefinition[];
  followUpQuestions: string[];
}

export interface CodeContext {
  surroundingElements: FlowElement[];
  programPurpose: string;
  userBackground: StudentProfile;
}

export interface TermDefinition {
  term: string;
  definition: string;
  example: string;
}

export interface StudentProfile {
  userId: string;
  preferredLanguage: VernacularLanguage;
  learningLevel: 'beginner' | 'intermediate' | 'advanced';
  programmingExperience: string[];
  culturalContext: 'urban' | 'rural' | 'semi-urban';
  accessibilityNeeds: string[];
}

// Audio Synthesis Interfaces
export interface AudioRequest {
  text: string;
  language: VernacularLanguage;
  voice: 'kajal' | 'aditi';
  speed: number;
  emphasis: EmphasisPoint[];
}

export interface AudioResponse {
  audioUrl: string;
  duration: number;
  timingMarkers: TimingMarker[];
  cacheKey: string;
}

export interface EmphasisPoint {
  word: string;
  level: 'strong' | 'moderate' | 'reduced';
}

export interface TimingMarker {
  word: string;
  startTime: number;
  endTime: number;
  elementId?: string;
}

// Synchronization Interfaces
export interface SyncRequest {
  audioUrl: string;
  timingMarkers: TimingMarker[];
  flowElements: FlowElement[];
}

export interface SyncEvent {
  timestamp: number;
  action: 'highlight' | 'unhighlight' | 'focus';
  elementId: string;
  intensity: number;
}

export interface SyncSession {
  sessionId: string;
  events: SyncEvent[];
  currentPosition: number;
  playbackRate: number;
}

// Visual Debugger Interfaces
export interface DebugRequest {
  code: string;
  language: ProgrammingLanguage;
  flowElements: FlowElement[];
}

export interface DebugResponse {
  errors: VisualError[];
  warnings: VisualWarning[];
  suggestions: CodeSuggestion[];
}

export interface VisualError {
  elementId: string;
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  vernacularExplanation: string;
  visualIndicator: ErrorVisualization;
}

export interface VisualWarning {
  elementId: string;
  message: string;
  vernacularExplanation: string;
}

export interface CodeSuggestion {
  elementId: string;
  suggestion: string;
  vernacularExplanation: string;
}

export interface ErrorVisualization {
  color: string;
  icon: string;
  animation?: string;
}

// Quiz/Viva Mode Interfaces
export interface QuizRequest {
  flowchart: VisualizationResponse;
  language: VernacularLanguage;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface QuizResponse {
  questions: QuizQuestion[];
  hiddenElements: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  audioUrl?: string;
  expectedAnswer: string;
  hints: string[];
  relatedElementIds: string[];
}
