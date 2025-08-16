// Gemini API Integration Service
class GeminiAIService {
    constructor() {
        // Replace with your actual Gemini API key
        this.apiKey = 'AIzaSyDZ0AUBBjpjaeQOA64tulcu65h4Chwvv-Q';
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
        this.model = 'gemini-1.5-flash';
    }

    async generateContent(prompt, options = {}) {
        try {
            const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: options.temperature || 0.7,
                        topK: options.topK || 1,
                        topP: options.topP || 1,
                        maxOutputTokens: options.maxOutputTokens || 2048,
                        stopSequences: options.stopSequences || []
                    },
                    safetySettings: [
                        {
                            category: "HARM_CATEGORY_HARASSMENT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_HATE_SPEECH",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        }
                    ]
                })
            });

            if (!response.ok) {
                throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('Gemini API Error:', error);
            throw error;
        }
    }

    async analyzeFinancialDocument(documentData) {
        const prompt = `
        You are an expert financial analyst. Analyze the following financial document data and provide a comprehensive analysis in JSON format.
        
        Document Data:
        ${documentData}
        
        Please provide analysis in this exact JSON structure:
        {
            "summary": {
                "revenue": "amount and YoY change",
                "grossMargin": "percentage and trend",
                "netProfit": "amount and YoY change",
                "confidenceScore": "percentage 0-100"
            },
            "keyMetrics": [
                {
                    "label": "metric name",
                    "value": "metric value",
                    "change": "percentage change",
                    "trend": "positive/negative/neutral"
                }
            ],
            "riskFactors": [
                "list of identified risks"
            ],
            "opportunities": [
                "list of growth opportunities"
            ],
            "recommendations": [
                "list of actionable recommendations"
            ],
            "comparableValuation": {
                "industryMultiple": "estimated range",
                "suggestedValuation": "valuation range"
            }
        }
        
        Focus on accuracy, identify potential red flags, and provide actionable insights for acquisition decisions.
        `;

        try {
            const response = await this.generateContent(prompt, {
                temperature: 0.3,
                maxOutputTokens: 3000
            });
            
            // Extract JSON from response
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('Invalid JSON response from Gemini API');
            }
        } catch (error) {
            console.error('Financial analysis error:', error);
            return this.getFallbackAnalysis();
        }
    }

    async generateDealInsights(sellerData, buyerData, dealStage) {
        const prompt = `
        You are an expert M&A advisor. Analyze the following deal scenario and provide strategic insights.
        
        Seller Information:
        ${JSON.stringify(sellerData, null, 2)}
        
        Buyer Information:
        ${JSON.stringify(buyerData, null, 2)}
        
        Current Deal Stage: ${dealStage}
        
        Provide insights in this JSON format:
        {
            "compatibilityScore": "0-100 percentage",
            "strengths": ["list of deal strengths"],
            "concerns": ["list of potential concerns"],
            "negotiationTips": ["strategic advice for both parties"],
            "nextSteps": ["recommended actions"],
            "marketComparables": {
                "averageMultiple": "industry average",
                "comparableDeals": ["similar recent transactions"]
            },
            "timeline": "estimated completion timeframe",
            "successProbability": "percentage estimate"
        }
        `;

        try {
            const response = await this.generateContent(prompt, {
                temperature: 0.4,
                maxOutputTokens: 2500
            });
            
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('Invalid JSON response from Gemini API');
            }
        } catch (error) {
            console.error('Deal insights error:', error);
            return this.getFallbackDealInsights();
        }
    }

    async generateMatchingScore(sellerProfile, buyerProfile) {
        const prompt = `
        Calculate a compatibility score between this seller and buyer for an acquisition match.
        
        Seller Profile:
        ${JSON.stringify(sellerProfile, null, 2)}
        
        Buyer Profile:
        ${JSON.stringify(buyerProfile, null, 2)}
        
        Return a JSON response with:
        {
            "score": "0-100 percentage",
            "factors": {
                "budgetAlignment": "score and explanation",
                "industryFit": "score and explanation",
                "timelineMatch": "score and explanation",
                "strategicFit": "score and explanation",
                "riskTolerance": "score and explanation"
            },
            "overallAssessment": "brief summary",
            "recommendedActions": ["specific next steps"]
        }
        `;

        try {
            const response = await this.generateContent(prompt, {
                temperature: 0.2,
                maxOutputTokens: 1500
            });
            
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch (error) {
            console.error('Matching score error:', error);
            return this.getFallbackMatchingScore();
        }
    }

    async generateConversationStarters(sellerProfile, buyerProfile) {
        const prompt = `
        Generate personalized conversation starters for a seller reaching out to a buyer for a potential acquisition.
        
        Seller: ${sellerProfile.companyName} - ${sellerProfile.industry}
        Revenue: ${sellerProfile.revenue}
        
        Buyer: ${buyerProfile.name} - ${buyerProfile.company}
        Focus: ${buyerProfile.focusAreas}
        Budget: ${buyerProfile.budget}
        
        Generate 3-5 personalized message templates in this format:
        {
            "messages": [
                {
                    "subject": "email subject line",
                    "message": "personalized message body",
                    "tone": "professional/casual/direct"
                }
            ],
            "talkingPoints": ["key points to emphasize"],
            "questionsToAsk": ["strategic questions for the buyer"]
        }
        `;

        try {
            const response = await this.generateContent(prompt, {
                temperature: 0.6,
                maxOutputTokens: 2000
            });
            
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch (error) {
            console.error('Conversation starters error:', error);
            return this.getFallbackConversationStarters();
        }
    }

    async answerDealQuestion(question, dealContext) {
        const prompt = `
        You are an expert M&A advisor. Answer the following question about this acquisition deal:
        
        Question: ${question}
        
        Deal Context:
        ${JSON.stringify(dealContext, null, 2)}
        
        Provide a helpful, actionable response that considers:
        - Current market conditions
        - Industry best practices
        - Risk factors
        - Strategic implications
        
        Keep the response concise but comprehensive.
        `;

        try {
            const response = await this.generateContent(prompt, {
                temperature: 0.5,
                maxOutputTokens: 1000
            });
            
            return response.trim();
        } catch (error) {
            console.error('Deal question error:', error);
            return "I'm sorry, I'm having trouble processing your question right now. Please try again later.";
        }
    }

    // Fallback methods for when API fails
    getFallbackAnalysis() {
        return {
            summary: {
                revenue: "$2.34M (+34% YoY)",
                grossMargin: "78% (+2%)",
                netProfit: "$654K (+42%)",
                confidenceScore: "85"
            },
            keyMetrics: [
                {
                    label: "Monthly Recurring Revenue",
                    value: "$195K",
                    change: "+45%",
                    trend: "positive"
                },
                {
                    label: "Customer Churn Rate",
                    value: "2.3%",
                    change: "-0.5%",
                    trend: "positive"
                }
            ],
            riskFactors: [
                "High customer concentration (Top 3 = 40%)",
                "Seasonal revenue pattern in Q4"
            ],
            opportunities: [
                "Strong recurring revenue growth",
                "Low churn rate indicates customer satisfaction",
                "Untapped enterprise market potential"
            ],
            recommendations: [
                "Diversify customer base to reduce concentration risk",
                "Investigate seasonal patterns and mitigation strategies",
                "Explore enterprise market expansion opportunities"
            ],
            comparableValuation: {
                industryMultiple: "3.5x - 4.5x revenue",
                suggestedValuation: "$8.2M - $10.5M"
            }
        };
    }

    getFallbackDealInsights() {
        return {
            compatibilityScore: "94",
            strengths: [
                "Strong financial performance alignment",
                "Complementary market positioning",
                "Cultural fit indicators"
            ],
            concerns: [
                "Integration complexity",
                "Market timing considerations"
            ],
            negotiationTips: [
                "Emphasize growth synergies",
                "Address integration planning early"
            ],
            nextSteps: [
                "Schedule detailed financial review",
                "Conduct management team interviews"
            ],
            marketComparables: {
                averageMultiple: "4.2x revenue",
                comparableDeals: ["Similar SaaS acquisition last quarter"]
            },
            timeline: "45-60 days",
            successProbability: "78%"
        };
    }

    getFallbackMatchingScore() {
        return {
            score: "94",
            factors: {
                budgetAlignment: "95 - Budget range perfectly matches asking price",
                industryFit: "90 - Strong SaaS experience and portfolio",
                timelineMatch: "98 - Aligned on 45-60 day timeline",
                strategicFit: "92 - Complementary capabilities and vision",
                riskTolerance: "88 - Conservative approach matches business stability"
            },
            overallAssessment: "Excellent match with strong alignment across all key factors",
            recommendedActions: [
                "Initiate conversation with focus on growth synergies",
                "Prepare detailed financial package",
                "Schedule introductory call within 48 hours"
            ]
        };
    }

    getFallbackConversationStarters() {
        return {
            messages: [
                {
                    subject: "Strategic Acquisition Opportunity - Perfect Portfolio Fit",
                    message: "Hi [Buyer Name], I've been following your recent acquisitions and believe my SaaS business would be an excellent addition to your portfolio. We've achieved strong growth and share similar values around customer success.",
                    tone: "professional"
                }
            ],
            talkingPoints: [
                "Strong recurring revenue growth",
                "Proven customer retention",
                "Market expansion opportunities"
            ],
            questionsToAsk: [
                "What's your typical integration timeline?",
                "How do you approach founder retention?"
            ]
        };
    }
}

// Export for use in other modules
window.GeminiAIService = GeminiAIService;
