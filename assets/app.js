/* ML Cheat Sheet Generator - ml0x.com */
(function() {
  'use strict';

  var sheets = {
    cnn: {
      title: 'Convolutional Neural Networks (CNN)',
      formulas: [
        'Output Size = <span class="frac"><span class="frac-num">W - K + 2P</span><span class="frac-den">S</span></span> + 1',
        'Parameters per conv layer = (K &times; K &times; C<sub>in</sub> + 1) &times; C<sub>out</sub>',
        'Receptive Field: r<sub>k</sub> = r<sub>k-1</sub> + (f<sub>k</sub> - 1) &times; j<sub>k-1</sub>'
      ],
      params: [
        ['Kernel Size', '3x3, 5x5', 'Smaller = more layers needed, fewer params'],
        ['Stride', '1, 2', 'Stride 2 halves spatial dims (replaces pooling)'],
        ['Padding', '0, same', 'Same padding preserves spatial dimensions'],
        ['Filters', '32-512', 'Double filters when halving spatial dims'],
        ['Learning Rate', '1e-3 to 1e-4', 'Use scheduler; reduce on plateau']
      ],
      whenToUse: 'Image classification, object detection, segmentation, any grid-structured data. CNNs exploit spatial locality through weight sharing.',
      pros: ['Translation invariance via shared weights', 'Efficient parameter usage vs fully connected', 'Proven architectures (ResNet, EfficientNet)', 'Works well with transfer learning'],
      cons: ['Not ideal for sequential data', 'Pooling loses spatial precision', 'Large models need significant GPU memory', 'Struggles with global context without depth'],
      code: '<span class="kw">import</span> torch.nn <span class="kw">as</span> nn\n\n<span class="kw">class</span> <span class="fn">SimpleCNN</span>(nn.Module):\n    <span class="kw">def</span> <span class="fn">__init__</span>(self, num_classes=<span class="num">10</span>):\n        <span class="fn">super</span>().__init__()\n        self.features = nn.Sequential(\n            nn.Conv2d(<span class="num">3</span>, <span class="num">32</span>, kernel_size=<span class="num">3</span>, padding=<span class="num">1</span>),\n            nn.ReLU(),\n            nn.MaxPool2d(<span class="num">2</span>),\n            nn.Conv2d(<span class="num">32</span>, <span class="num">64</span>, kernel_size=<span class="num">3</span>, padding=<span class="num">1</span>),\n            nn.ReLU(),\n            nn.MaxPool2d(<span class="num">2</span>),\n        )\n        self.classifier = nn.Linear(<span class="num">64</span> * <span class="num">8</span> * <span class="num">8</span>, num_classes)\n\n    <span class="kw">def</span> <span class="fn">forward</span>(self, x):\n        x = self.features(x)\n        x = x.view(x.size(<span class="num">0</span>), -<span class="num">1</span>)\n        <span class="kw">return</span> self.classifier(x)'
    },
    rnn: {
      title: 'RNN / LSTM / GRU',
      formulas: [
        'RNN: h<sub>t</sub> = tanh(W<sub>hh</sub> h<sub>t-1</sub> + W<sub>xh</sub> x<sub>t</sub> + b)',
        'LSTM Forget Gate: f<sub>t</sub> = &sigma;(W<sub>f</sub> [h<sub>t-1</sub>, x<sub>t</sub>] + b<sub>f</sub>)',
        'LSTM Cell State: C<sub>t</sub> = f<sub>t</sub> &odot; C<sub>t-1</sub> + i<sub>t</sub> &odot; C&#771;<sub>t</sub>',
        'GRU Update: z<sub>t</sub> = &sigma;(W<sub>z</sub> [h<sub>t-1</sub>, x<sub>t</sub>])'
      ],
      params: [
        ['Hidden Size', '64-1024', 'Larger = more capacity, slower training'],
        ['Num Layers', '1-4', 'Stacking layers adds depth; use dropout between'],
        ['Dropout', '0.1-0.5', 'Apply between layers, not within recurrence'],
        ['Bidirectional', 'True/False', 'True for classification, False for generation'],
        ['Learning Rate', '1e-3', 'Clip gradients to 1.0-5.0 to avoid explosion']
      ],
      whenToUse: 'Sequential data: time series, text (pre-transformer era), speech. LSTM/GRU solve vanishing gradients for longer sequences. GRU is faster with similar performance.',
      pros: ['Natural fit for sequences', 'LSTM/GRU handle long-range dependencies', 'Variable-length input support', 'Fewer parameters than transformers for small data'],
      cons: ['Sequential processing = slow training', 'Vanishing gradients in vanilla RNN', 'Struggles with very long sequences (>500 tokens)', 'Largely superseded by transformers'],
      code: '<span class="kw">import</span> torch.nn <span class="kw">as</span> nn\n\n<span class="kw">class</span> <span class="fn">LSTMClassifier</span>(nn.Module):\n    <span class="kw">def</span> <span class="fn">__init__</span>(self, vocab_size, embed_dim=<span class="num">128</span>,\n                 hidden=<span class="num">256</span>, num_classes=<span class="num">2</span>):\n        <span class="fn">super</span>().__init__()\n        self.embed = nn.Embedding(vocab_size, embed_dim)\n        self.lstm = nn.LSTM(embed_dim, hidden,\n                           batch_first=<span class="kw">True</span>,\n                           bidirectional=<span class="kw">True</span>)\n        self.fc = nn.Linear(hidden * <span class="num">2</span>, num_classes)\n\n    <span class="kw">def</span> <span class="fn">forward</span>(self, x):\n        x = self.embed(x)\n        _, (h, _) = self.lstm(x)\n        h = torch.cat([h[-<span class="num">2</span>], h[-<span class="num">1</span>]], dim=<span class="num">1</span>)\n        <span class="kw">return</span> self.fc(h)'
    },
    transformers: {
      title: 'Transformers',
      formulas: [
        'Attention(Q,K,V) = softmax(<span class="frac"><span class="frac-num">QK<sup>T</sup></span><span class="frac-den">&radic;d<sub>k</sub></span></span>)V',
        'MultiHead = Concat(head<sub>1</sub>,...,head<sub>h</sub>)W<sup>O</sup>',
        'FFN(x) = max(0, xW<sub>1</sub> + b<sub>1</sub>)W<sub>2</sub> + b<sub>2</sub>',
        'PE<sub>(pos,2i)</sub> = sin(pos / 10000<sup>2i/d</sup>)'
      ],
      params: [
        ['d_model', '256-1024', 'Embedding dimension; must be divisible by heads'],
        ['Num Heads', '4-16', 'Each head: d_k = d_model / num_heads'],
        ['Num Layers', '6-24', 'Deeper = more capacity; watch for degradation'],
        ['FFN Dim', '4 * d_model', 'Standard ratio; some use 8/3 * d_model (SwiGLU)'],
        ['Learning Rate', '1e-4 to 5e-5', 'Use warmup + cosine decay']
      ],
      whenToUse: 'NLP (BERT, GPT), vision (ViT), multi-modal tasks. Transformers handle long-range dependencies via self-attention and parallelize well on GPUs.',
      pros: ['Parallelizable (unlike RNNs)', 'Handles long-range dependencies', 'State-of-the-art across NLP and vision', 'Scales predictably with data and compute'],
      cons: ['O(n\u00B2) attention complexity with sequence length', 'Requires large datasets and compute', 'Positional encoding is a design choice', 'Memory-intensive for long sequences'],
      code: '<span class="kw">import</span> torch.nn <span class="kw">as</span> nn\n\n<span class="kw">class</span> <span class="fn">TransformerBlock</span>(nn.Module):\n    <span class="kw">def</span> <span class="fn">__init__</span>(self, d_model=<span class="num">512</span>, nhead=<span class="num">8</span>,\n                 ff_dim=<span class="num">2048</span>, dropout=<span class="num">0.1</span>):\n        <span class="fn">super</span>().__init__()\n        self.attn = nn.MultiheadAttention(\n            d_model, nhead, dropout=dropout)\n        self.ff = nn.Sequential(\n            nn.Linear(d_model, ff_dim),\n            nn.ReLU(),\n            nn.Linear(ff_dim, d_model))\n        self.norm1 = nn.LayerNorm(d_model)\n        self.norm2 = nn.LayerNorm(d_model)\n        self.drop = nn.Dropout(dropout)\n\n    <span class="kw">def</span> <span class="fn">forward</span>(self, x):\n        att = self.attn(x, x, x)[<span class="num">0</span>]\n        x = self.norm1(x + self.drop(att))\n        ff = self.ff(x)\n        <span class="kw">return</span> self.norm2(x + self.drop(ff))'
    },
    decision_trees: {
      title: 'Decision Trees',
      formulas: [
        'Gini Impurity: G = 1 - &sum;<sub>i=1</sub><sup>C</sup> p<sub>i</sub><sup>2</sup>',
        'Entropy: H = -&sum;<sub>i=1</sub><sup>C</sup> p<sub>i</sub> log<sub>2</sub>(p<sub>i</sub>)',
        'Information Gain: IG = H(parent) - &sum; <span class="frac"><span class="frac-num">N<sub>child</sub></span><span class="frac-den">N<sub>parent</sub></span></span> H(child)'
      ],
      params: [
        ['max_depth', '3-20', 'Controls overfitting; start shallow'],
        ['min_samples_split', '2-20', 'Higher = more conservative splits'],
        ['min_samples_leaf', '1-10', 'Minimum samples in leaf node'],
        ['criterion', 'gini / entropy', 'Gini is faster; entropy slightly more thorough'],
        ['max_features', 'sqrt, log2, None', 'For random forests; None = all features']
      ],
      whenToUse: 'Tabular data, when interpretability matters. Great for feature importance analysis and as building blocks for ensembles (Random Forest, XGBoost).',
      pros: ['Highly interpretable (visualize the tree)', 'No feature scaling needed', 'Handles categorical and numerical data', 'Fast inference'],
      cons: ['Prone to overfitting without pruning', 'Unstable (small data changes = different tree)', 'Biased toward features with more levels', 'Cannot extrapolate beyond training range'],
      code: '<span class="kw">from</span> sklearn.tree <span class="kw">import</span> DecisionTreeClassifier\n<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> cross_val_score\n\n<span class="cm"># Train with pruning to avoid overfitting</span>\ndt = DecisionTreeClassifier(\n    max_depth=<span class="num">8</span>,\n    min_samples_split=<span class="num">10</span>,\n    min_samples_leaf=<span class="num">5</span>,\n    criterion=<span class="str">\'gini\'</span>\n)\n\nscores = cross_val_score(dt, X, y, cv=<span class="num">5</span>)\nprint(<span class="str">f\'Accuracy: {scores.mean():.3f}\'</span>)\n\ndt.fit(X_train, y_train)\nprint(<span class="str">f\'Depth: {dt.get_depth()}\'</span>)\nprint(<span class="str">f\'Leaves: {dt.get_n_leaves()}\'</span>)'
    },
    svm: {
      title: 'Support Vector Machines (SVM)',
      formulas: [
        'Objective: min <span class="frac"><span class="frac-num">1</span><span class="frac-den">2</span></span> ||w||<sup>2</sup> + C &sum;<sub>i</sub> &xi;<sub>i</sub>',
        'Decision: f(x) = sign(w &middot; x + b)',
        'RBF Kernel: K(x,x\') = exp(-&gamma; ||x - x\'||<sup>2</sup>)',
        'Polynomial: K(x,x\') = (&gamma; x &middot; x\' + r)<sup>d</sup>'
      ],
      params: [
        ['C', '0.1-100', 'Regularization: high C = less regularization'],
        ['kernel', 'rbf, linear, poly', 'RBF is default; linear for high-dim sparse data'],
        ['gamma', 'scale, auto, float', 'RBF width: small = wide boundary, large = tight'],
        ['degree', '2-5', 'Only for polynomial kernel'],
        ['class_weight', 'balanced, None', 'Use balanced for imbalanced datasets']
      ],
      whenToUse: 'Binary classification with clear margin of separation. Effective in high-dimensional spaces. Works well with small-to-medium datasets where kernel trick helps.',
      pros: ['Effective in high dimensions', 'Memory efficient (uses support vectors only)', 'Versatile via kernel functions', 'Strong theoretical guarantees (margin maximization)'],
      cons: ['Slow training on large datasets O(n\u00B2-n\u00B3)', 'Sensitive to feature scaling', 'No native probability output (Platt scaling needed)', 'Kernel choice requires experimentation'],
      code: '<span class="kw">from</span> sklearn.svm <span class="kw">import</span> SVC\n<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler\n<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline\n\n<span class="cm"># Always scale features for SVM</span>\npipe = Pipeline([\n    (<span class="str">\'scaler\'</span>, StandardScaler()),\n    (<span class="str">\'svm\'</span>, SVC(\n        kernel=<span class="str">\'rbf\'</span>,\n        C=<span class="num">1.0</span>,\n        gamma=<span class="str">\'scale\'</span>,\n        probability=<span class="kw">True</span>\n    ))\n])\n\npipe.fit(X_train, y_train)\nprint(<span class="str">f\'Accuracy: {pipe.score(X_test, y_test):.3f}\'</span>)\n<span class="cm"># Number of support vectors per class</span>\nprint(pipe[<span class="str">\'svm\'</span>].n_support_)'
    },
    knn: {
      title: 'K-Nearest Neighbors (KNN)',
      formulas: [
        'Euclidean: d(x,y) = &radic;(&sum;<sub>i</sub> (x<sub>i</sub> - y<sub>i</sub>)<sup>2</sup>)',
        'Manhattan: d(x,y) = &sum;<sub>i</sub> |x<sub>i</sub> - y<sub>i</sub>|',
        'Minkowski: d(x,y) = (&sum;<sub>i</sub> |x<sub>i</sub> - y<sub>i</sub>|<sup>p</sup>)<sup>1/p</sup>',
        'Weighted vote: w<sub>i</sub> = <span class="frac"><span class="frac-num">1</span><span class="frac-den">d(x, x<sub>i</sub>)<sup>2</sup></span></span>'
      ],
      params: [
        ['n_neighbors (k)', '3-21 (odd)', 'Odd avoids ties; use CV to tune'],
        ['weights', 'uniform, distance', 'Distance weighting helps when neighbors vary'],
        ['metric', 'euclidean, manhattan', 'Manhattan better for high-dimensional data'],
        ['algorithm', 'ball_tree, kd_tree, brute', 'Auto selects; kd_tree fails in high dims'],
        ['leaf_size', '20-50', 'Affects tree build and query speed']
      ],
      whenToUse: 'Small datasets, few features, when you need a simple baseline. Good for recommendation systems and anomaly detection. Non-parametric: no training phase.',
      pros: ['No training phase (lazy learner)', 'Simple to understand and implement', 'No assumptions about data distribution', 'Naturally handles multi-class problems'],
      cons: ['Slow prediction on large datasets O(nd)', 'Curse of dimensionality', 'Requires feature scaling', 'Memory-intensive (stores all training data)'],
      code: '<span class="kw">from</span> sklearn.neighbors <span class="kw">import</span> KNeighborsClassifier\n<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler\n<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> GridSearchCV\n\nscaler = StandardScaler()\nX_train_s = scaler.fit_transform(X_train)\nX_test_s = scaler.transform(X_test)\n\n<span class="cm"># Find optimal k</span>\nparam_grid = {<span class="str">\'n_neighbors\'</span>: range(<span class="num">3</span>, <span class="num">22</span>, <span class="num">2</span>)}\nknn = GridSearchCV(\n    KNeighborsClassifier(weights=<span class="str">\'distance\'</span>),\n    param_grid, cv=<span class="num">5</span>\n)\nknn.fit(X_train_s, y_train)\nprint(<span class="str">f\'Best k: {knn.best_params_}\'</span>)\nprint(<span class="str">f\'Accuracy: {knn.score(X_test_s, y_test):.3f}\'</span>)'
    },
    linear_regression: {
      title: 'Linear Regression',
      formulas: [
        'Model: y&#770; = w<sub>0</sub> + w<sub>1</sub>x<sub>1</sub> + ... + w<sub>n</sub>x<sub>n</sub> = X&middot;w',
        'OLS Solution: w = (X<sup>T</sup>X)<sup>-1</sup>X<sup>T</sup>y',
        'MSE = <span class="frac"><span class="frac-num">1</span><span class="frac-den">n</span></span> &sum;<sub>i</sub> (y<sub>i</sub> - y&#770;<sub>i</sub>)<sup>2</sup>',
        'R<sup>2</sup> = 1 - <span class="frac"><span class="frac-num">&sum;(y<sub>i</sub> - y&#770;<sub>i</sub>)<sup>2</sup></span><span class="frac-den">&sum;(y<sub>i</sub> - y&#772;)<sup>2</sup></span></span>'
      ],
      params: [
        ['fit_intercept', 'True/False', 'True unless data is centered'],
        ['alpha (Ridge)', '0.01-100', 'L2 regularization strength'],
        ['alpha (Lasso)', '0.001-1', 'L1 for sparse feature selection'],
        ['l1_ratio (ElasticNet)', '0-1', '0 = Ridge, 1 = Lasso, between = mix'],
        ['normalize', 'True/False', 'Deprecated; use StandardScaler in pipeline']
      ],
      whenToUse: 'Predicting continuous values when you expect a linear relationship. Start here as a baseline for regression tasks. Use regularized variants (Ridge/Lasso) when features are correlated or numerous.',
      pros: ['Fast training and inference', 'Highly interpretable (coefficients = feature importance)', 'Closed-form solution (no hyperparameter tuning for OLS)', 'Statistical inference built-in (p-values, confidence intervals)'],
      cons: ['Assumes linear relationship', 'Sensitive to outliers', 'Multicollinearity inflates coefficient variance', 'Cannot capture non-linear patterns without feature engineering'],
      code: '<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> Ridge\n<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> mean_squared_error, r2_score\n<span class="kw">import</span> numpy <span class="kw">as</span> np\n\n<span class="cm"># Ridge regression with cross-validation</span>\nmodel = Ridge(alpha=<span class="num">1.0</span>)\nmodel.fit(X_train, y_train)\n\ny_pred = model.predict(X_test)\nrmse = np.sqrt(mean_squared_error(y_test, y_pred))\nr2 = r2_score(y_test, y_pred)\n\nprint(<span class="str">f\'RMSE: {rmse:.3f}\'</span>)\nprint(<span class="str">f\'R\u00B2:   {r2:.3f}\'</span>)\n\n<span class="cm"># Feature importance</span>\n<span class="kw">for</span> name, coef <span class="kw">in</span> zip(feature_names, model.coef_):\n    print(<span class="str">f\'{name}: {coef:.4f}\'</span>)'
    },
    logistic_regression: {
      title: 'Logistic Regression',
      formulas: [
        'Sigmoid: &sigma;(z) = <span class="frac"><span class="frac-num">1</span><span class="frac-den">1 + e<sup>-z</sup></span></span>',
        'P(y=1|x) = &sigma;(w &middot; x + b)',
        'Loss: L = -<span class="frac"><span class="frac-num">1</span><span class="frac-den">n</span></span>&sum;[y<sub>i</sub> log(p<sub>i</sub>) + (1-y<sub>i</sub>) log(1-p<sub>i</sub>)]',
        'Softmax: P(y=k) = <span class="frac"><span class="frac-num">e<sup>z<sub>k</sub></sup></span><span class="frac-den">&sum;<sub>j</sub> e<sup>z<sub>j</sub></sup></span></span>'
      ],
      params: [
        ['C', '0.01-100', 'Inverse regularization (higher = less reg)'],
        ['penalty', 'l1, l2, elasticnet', 'L1 for feature selection; L2 default'],
        ['solver', 'lbfgs, saga, liblinear', 'saga for large data; liblinear for small + L1'],
        ['max_iter', '100-1000', 'Increase if convergence warning'],
        ['class_weight', 'balanced, None', 'Balanced for imbalanced classes']
      ],
      whenToUse: 'Binary or multi-class classification when you need probability outputs and interpretability. Default starting point for classification. Use when features have roughly linear relationship with log-odds.',
      pros: ['Outputs calibrated probabilities', 'Fast and scalable', 'Interpretable (odds ratios from coefficients)', 'Low variance, less prone to overfitting'],
      cons: ['Assumes linear decision boundary in feature space', 'Needs feature engineering for non-linear relationships', 'Struggles with highly correlated features (without regularization)', 'Not suitable for complex patterns without kernel trick'],
      code: '<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression\n<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> classification_report\n\nmodel = LogisticRegression(\n    C=<span class="num">1.0</span>,\n    penalty=<span class="str">\'l2\'</span>,\n    solver=<span class="str">\'lbfgs\'</span>,\n    max_iter=<span class="num">500</span>,\n    class_weight=<span class="str">\'balanced\'</span>\n)\nmodel.fit(X_train, y_train)\n\ny_pred = model.predict(X_test)\ny_prob = model.predict_proba(X_test)[:, <span class="num">1</span>]\n\nprint(classification_report(y_test, y_pred))\n\n<span class="cm"># Odds ratios</span>\n<span class="kw">import</span> numpy <span class="kw">as</span> np\nodds = np.exp(model.coef_[<span class="num">0</span>])\n<span class="kw">for</span> name, od <span class="kw">in</span> zip(feature_names, odds):\n    print(<span class="str">f\'{name}: OR={od:.2f}\'</span>)'
    },
    gradient_descent: {
      title: 'Gradient Descent',
      formulas: [
        'Update Rule: &theta; := &theta; - &alpha; &nabla;<sub>&theta;</sub> J(&theta;)',
        'SGD Momentum: v<sub>t</sub> = &beta;v<sub>t-1</sub> + &alpha;&nabla;J(&theta;)',
        'Adam: m<sub>t</sub> = &beta;<sub>1</sub>m<sub>t-1</sub> + (1-&beta;<sub>1</sub>)g<sub>t</sub>',
        'Adam: v<sub>t</sub> = &beta;<sub>2</sub>v<sub>t-1</sub> + (1-&beta;<sub>2</sub>)g<sub>t</sub><sup>2</sup>',
        '&theta;<sub>t</sub> = &theta;<sub>t-1</sub> - &alpha; <span class="frac"><span class="frac-num">m&#770;<sub>t</sub></span><span class="frac-den">&radic;(v&#770;<sub>t</sub>) + &epsilon;</span></span>'
      ],
      params: [
        ['Learning Rate (\u03B1)', '1e-4 to 1e-2', 'Too high = diverge; too low = slow convergence'],
        ['Batch Size', '32-256', 'Larger = more stable gradients, more memory'],
        ['Momentum (\u03B2)', '0.9', 'Accelerates convergence; dampens oscillations'],
        ['\u03B2\u2081 (Adam)', '0.9', 'First moment decay; rarely changed'],
        ['\u03B2\u2082 (Adam)', '0.999', 'Second moment decay; 0.95 for noisy gradients']
      ],
      whenToUse: 'Training any neural network or large-scale ML model. Adam is the default choice. SGD with momentum can generalize better with proper tuning. AdamW for transformers.',
      pros: ['Scales to massive datasets (mini-batch)', 'Adam adapts learning rates per parameter', 'Momentum escapes shallow local minima', 'Theoretical convergence guarantees'],
      cons: ['Requires learning rate tuning', 'Adam can converge to sharp minima (worse generalization)', 'SGD needs careful momentum/LR schedule', 'Sensitive to gradient scale (use gradient clipping)'],
      code: '<span class="kw">import</span> torch\n<span class="kw">import</span> torch.optim <span class="kw">as</span> optim\n\nmodel = MyModel()\n\n<span class="cm"># Adam with weight decay (AdamW)</span>\noptimizer = optim.AdamW(\n    model.parameters(),\n    lr=<span class="num">3e-4</span>,\n    weight_decay=<span class="num">0.01</span>\n)\n\n<span class="cm"># Cosine annealing scheduler</span>\nscheduler = optim.lr_scheduler.CosineAnnealingLR(\n    optimizer, T_max=<span class="num">100</span>\n)\n\n<span class="kw">for</span> epoch <span class="kw">in</span> range(<span class="num">100</span>):\n    <span class="kw">for</span> batch <span class="kw">in</span> dataloader:\n        loss = criterion(model(batch.x), batch.y)\n        optimizer.zero_grad()\n        loss.backward()\n        torch.nn.utils.clip_grad_norm_(\n            model.parameters(), max_norm=<span class="num">1.0</span>)\n        optimizer.step()\n    scheduler.step()'
    },
    regularization: {
      title: 'Regularization Techniques',
      formulas: [
        'L2 (Ridge): J = Loss + &lambda; &sum;<sub>i</sub> w<sub>i</sub><sup>2</sup>',
        'L1 (Lasso): J = Loss + &lambda; &sum;<sub>i</sub> |w<sub>i</sub>|',
        'Elastic Net: J = Loss + &lambda;<sub>1</sub>&sum;|w<sub>i</sub>| + &lambda;<sub>2</sub>&sum;w<sub>i</sub><sup>2</sup>',
        'Dropout: h\' = h &odot; m,  m<sub>i</sub> ~ Bernoulli(p)',
        'BatchNorm: y = &gamma; <span class="frac"><span class="frac-num">x - &mu;<sub>B</sub></span><span class="frac-den">&radic;(&sigma;<sub>B</sub><sup>2</sup> + &epsilon;)</span></span> + &beta;'
      ],
      params: [
        ['lambda (\u03BB)', '1e-4 to 1.0', 'Regularization strength; tune via cross-validation'],
        ['Dropout rate', '0.1-0.5', '0.1 for embeddings, 0.3-0.5 for dense layers'],
        ['Weight decay', '0.01-0.1', 'Equivalent to L2 in AdamW; 0.01 is common'],
        ['Early stopping patience', '5-20', 'Epochs to wait before stopping on val loss'],
        ['Data augmentation', 'task-specific', 'Flips, crops, noise for images; paraphrase for text']
      ],
      whenToUse: 'Whenever your model overfits (train acc >> val acc). L2 is default for linear models. Dropout is standard for neural networks. Combine multiple techniques for best results.',
      pros: ['Prevents overfitting and improves generalization', 'L1 gives automatic feature selection', 'Dropout is simple and effective for deep networks', 'BatchNorm accelerates training and adds mild regularization'],
      cons: ['L1 can over-sparsify; some useful features may be zeroed', 'Dropout slows convergence (need more epochs)', 'BatchNorm behaves differently in train vs eval mode', 'Over-regularization leads to underfitting'],
      code: '<span class="kw">import</span> torch.nn <span class="kw">as</span> nn\n\n<span class="kw">class</span> <span class="fn">RegularizedNet</span>(nn.Module):\n    <span class="kw">def</span> <span class="fn">__init__</span>(self, in_features, num_classes):\n        <span class="fn">super</span>().__init__()\n        self.net = nn.Sequential(\n            nn.Linear(in_features, <span class="num">256</span>),\n            nn.BatchNorm1d(<span class="num">256</span>),\n            nn.ReLU(),\n            nn.Dropout(<span class="num">0.3</span>),\n            nn.Linear(<span class="num">256</span>, <span class="num">128</span>),\n            nn.BatchNorm1d(<span class="num">128</span>),\n            nn.ReLU(),\n            nn.Dropout(<span class="num">0.3</span>),\n            nn.Linear(<span class="num">128</span>, num_classes)\n        )\n\n    <span class="kw">def</span> <span class="fn">forward</span>(self, x):\n        <span class="kw">return</span> self.net(x)\n\n<span class="cm"># Use AdamW for decoupled weight decay</span>\noptimizer = torch.optim.AdamW(\n    model.parameters(), lr=<span class="num">1e-3</span>,\n    weight_decay=<span class="num">0.01</span>)'
    }
  };

  function buildMarkdown(key) {
    var s = sheets[key];
    var lines = ['# ' + s.title, ''];
    lines.push('## Key Formulas');
    for (var i = 0; i < s.formulas.length; i++) {
      lines.push('- ' + s.formulas[i].replace(/<[^>]+>/g, ''));
    }
    lines.push('');
    lines.push('## Hyperparameters');
    lines.push('| Parameter | Typical Range | Notes |');
    lines.push('|-----------|--------------|-------|');
    for (var j = 0; j < s.params.length; j++) {
      lines.push('| ' + s.params[j][0] + ' | ' + s.params[j][1] + ' | ' + s.params[j][2] + ' |');
    }
    lines.push('');
    lines.push('## When to Use');
    lines.push(s.whenToUse);
    lines.push('');
    lines.push('## Pros');
    for (var k = 0; k < s.pros.length; k++) lines.push('- ' + s.pros[k]);
    lines.push('');
    lines.push('## Cons');
    for (var l = 0; l < s.cons.length; l++) lines.push('- ' + s.cons[l]);
    lines.push('');
    lines.push('## Code Example');
    var codeText = s.code.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&times;/g, 'x').replace(/&middot;/g, '*');
    lines.push('```python');
    lines.push(codeText);
    lines.push('```');
    return lines.join('\n');
  }

  function renderSheet(key) {
    var s = sheets[key];
    var el = document.getElementById('cheat-sheet');
    var formulasHTML = '';
    for (var i = 0; i < s.formulas.length; i++) {
      formulasHTML += '<div class="formula-block">' + s.formulas[i] + '</div>';
    }
    var paramsHTML = '<table class="params-table"><thead><tr><th>Parameter</th><th>Range</th><th>Notes</th></tr></thead><tbody>';
    for (var j = 0; j < s.params.length; j++) {
      paramsHTML += '<tr><td>' + s.params[j][0] + '</td><td>' + s.params[j][1] + '</td><td>' + s.params[j][2] + '</td></tr>';
    }
    paramsHTML += '</tbody></table>';
    var prosHTML = '<ul>';
    for (var k = 0; k < s.pros.length; k++) prosHTML += '<li>' + s.pros[k] + '</li>';
    prosHTML += '</ul>';
    var consHTML = '<ul>';
    for (var l = 0; l < s.cons.length; l++) consHTML += '<li>' + s.cons[l] + '</li>';
    consHTML += '</ul>';

    el.innerHTML = '<h2>' + s.title + '</h2>' +
      '<div class="sheet-section"><h3>Key Formulas</h3>' + formulasHTML + '</div>' +
      '<div class="sheet-section"><h3>Hyperparameters</h3>' + paramsHTML + '</div>' +
      '<div class="sheet-section"><h3>When to Use</h3><div class="when-to-use">' + s.whenToUse + '</div></div>' +
      '<div class="sheet-section"><h3>Pros &amp; Cons</h3><div class="pros-cons"><div class="pros">' + prosHTML + '</div><div class="cons">' + consHTML + '</div></div></div>' +
      '<div class="sheet-section"><h3>Code Example (Python)</h3><div class="code-block">' + s.code + '</div></div>' +
      '<div class="actions"><button class="btn" onclick="window.mlApp.printSheet()">Print Cheat Sheet</button><button class="btn btn-secondary" onclick="window.mlApp.copyMarkdown()">Copy as Markdown</button></div>';
    el.classList.add('visible');
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function showToast(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(function() { t.classList.remove('show'); }, 2000);
  }

  window.mlApp = {
    selectTopic: function(key, btn) {
      var btns = document.querySelectorAll('.topic-btn');
      for (var i = 0; i < btns.length; i++) btns[i].classList.remove('active');
      btn.classList.add('active');
      window.mlApp.currentKey = key;
      renderSheet(key);
    },
    printSheet: function() { window.print(); },
    copyMarkdown: function() {
      if (!window.mlApp.currentKey) return;
      var md = buildMarkdown(window.mlApp.currentKey);
      navigator.clipboard.writeText(md).then(function() {
        showToast('Copied to clipboard!');
      });
    },
    currentKey: null
  };
})();
